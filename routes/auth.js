const express = require('express');
const User = require('../models/user.js')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth.js');
const authMw = require('../middlewares/auth.js');


const authRouter = express.Router();

authRouter.get('/users', (req, res) => {
    res.json({ name: 'Quoc Huy' })
})

//sign up
authRouter.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    try {
        if (existingUser) {
            return res.status(400).json({ msg: 'User with same email aldready exits.' })
        }

        const hashedPassword = await bcryptjs.hash(password, 8);
        let user = new User({
            name,
            email,
            password: hashedPassword
        });

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//sign in
authRouter.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User with this email does not exit.' })
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
})

authRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);
        const verified = jwt.verify(token, 'passwordKey');
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
})

authRouter.get('/', authMw, async (req, res) => {
    const uesr = await User.findById(req.user);
    res.json({ ...uesr._doc, token: req.token });
})

module.exports = authRouter;
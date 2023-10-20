const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminMw = async (req, res, next) => {
    try {
        const fl_token = req.header("x-auth-token");
        const token = fl_token.replace(/"/g, '');
        if (!token)
            return res.status(401).json({ msg: "No auth token, access denied" });
        const verified = jwt.verify(token, "passwordKey");
        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });
        const user = await User.findById(verified.id);
        if (user.type == "user" || user.type == "seller") {
            return res.status(401).json({ msg: "You are not an admin!" });
        }
        req.user = verified.id;
        req.token = token;
        next();
    } catch (err) {
        console.log('123');
        res.status(500).json({ error: err.message });
    }
};

module.exports = adminMw;



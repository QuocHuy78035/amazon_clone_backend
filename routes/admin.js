const express = require('express');

const adminRouter = express.Router();
const adminMw = require('../middlewares/admin.js');
const Product = require('../models/product.js').Product;

adminRouter.post("/admin/add-product", adminMw, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


adminRouter.get('/admin/get-products', adminMw, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
})


adminRouter.post('/admin/delete-products', adminMw, async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);
        let product = await Product.findByIdAndDelete(id);
        res.json({ msg: "Delete Sucessfully" });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = adminRouter
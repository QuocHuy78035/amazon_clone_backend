const express = require('express');
const authMw = require('../middlewares/auth.js');
const Product = require('../models/product.js').Product;
const productRouter = express.Router();

productRouter.get("/api/products/", authMw, async (req, res) => {
    try {
        const products = await Product.find({ category: req.query.category });
        res.json(products);
    } catch (e) {
        console.log('123');
        res.status(500).json({ error: e.message });
    }
});

productRouter.get("/api/products/search/:name", authMw, async (req, res) => {
    try {
        const products = await Product.find({
            name: { $regex: req.params.name, $options: "i" },
        });
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRouter.post('/api/rate-product', authMw, async (req, res) => {
    try {
        const { _id, rating } = req.body;
        console.log(_id);
        console.log(req.user);
        let product = await Product.findById(_id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        for (let i = 0; i < product.ratings.length; i++) {
            if (product.ratings[i].userId == req.user) {
                product.ratings.splice(i, 1);
                break;
            }
        }

        const ratingSchema = {
            "userId": req.user,
            "rating": rating
        }
        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRouter.get("/api/deal-of-day", authMw, async (req, res) => {
    try {
        let products = await Product.find({});

        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;

            for (let i = 0; i < a.ratings.length; i++) {
                aSum += a.ratings[i].rating;
            }

            for (let i = 0; i < b.ratings.length; i++) {
                bSum += b.ratings[i].rating;
            }
            return aSum < bSum ? 1 : -1;
        });

        res.json(products[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = productRouter;

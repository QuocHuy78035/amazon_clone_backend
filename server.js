const express = require('express');
const mongoose = require('mongoose');

//import file 
const authRouter = require('../backend/routes/auth.js');
const adminRouter = require('../backend/routes/admin.js');
const productRouter = require('./routes/products.js');
const userRouter = require('./routes/user.js');

//init
const PORT = 8000;
const app = express();
const DB = 'mongodb+srv://flutteramazonclone:huypro0320092003@cluster0.d1fgwdm.mongodb.net/?retryWrites=true&w=majority'

//midleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(userRouter)
app.use(productRouter)


//connection
mongoose.connect(DB)
    .then(() => {
        console.log('Connect to mongoose Successful')
    })
    .catch((e) => {
        console.log(e)
    });


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at port: ${PORT}`);
}) 
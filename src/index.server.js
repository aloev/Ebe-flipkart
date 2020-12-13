

const express = require('express');
const app = express();
const env = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongodb+srv://mern_ecommerce:<password>@cluster0.rzssv.mongodb.net/test

// constants

env.config();


// routes

const userRoutes = require('./routes/auth_route');
const adminRoutes = require('./routes/admin/auth_route');
const categoryRoutes = require('./routes/category_route');
const productRoutes = require('./routes/product_route');
const cartRoutes = require('./routes/cart_route');

// Change to admin database
mongoose.connect(
    // `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.rzssv.mongodb.net/mern_ecommerce?retryeWrite=true&w=majority`, 
    `mongodb+srv://mern_ecommerce:${process.env.PASSWORD}@cluster0.rzssv.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
).then(() => {
    console.log('Database connected');
});


app.use(express.json());    // add middleware


app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`, )
})

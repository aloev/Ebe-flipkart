

const express = require('express');
const app = express();
const env = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

//mongodb+srv://mern_ecommerce:<password>@cluster0.rzssv.mongodb.net/test

// constants

env.config();


// routes

const userRoutes = require('./routes/auth_route');
const adminRoutes = require('./routes/admin/auth_route');
const addressRoutes = require('./routes/address_route');
const orderRoutes = require('./routes/order_route');
const categoryRoutes = require('./routes/category_route');
const productRoutes = require('./routes/product_route');
const cartRoutes = require('./routes/cart_route');
const pageRoutes = require('./routes/admin/page_route');
const initialDRoutes = require('./routes/admin/initialData_route');
const adminOrderRoutes = require('./routes/admin/order_admin_route');

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

// Directorio publico

app.use( express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());    // add middleware
app.use('/public',express.static(path.join(__dirname, 'uploads')));

app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', addressRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', pageRoutes);
app.use('/api', orderRoutes);
app.use('/api', initialDRoutes);
app.use('/api', adminOrderRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`, )
})

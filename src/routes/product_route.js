

const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../common-middleware/index');
const { createProduct, getProductsBySlug, getProductDetailsById, deleteProductById, getProducts } = require('../controllers/product_controller');
const multer = require('multer');
//const { addCategory, getCategories } = require('../controllers/category_controller');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
});
   
const upload = multer({ storage});


router.post('/product/create', requireSignin , adminMiddleware , upload.array('productPicture'), createProduct);
router.get('/products/:slug', getProductsBySlug  );
router.get('/products/detail/:productId', getProductDetailsById  );   // Just had to change the position this was in
router.delete('/products/deleteProductById/:productId', deleteProductById  );   
router.post('/products/getProducts', getProducts  );   


module.exports = router;
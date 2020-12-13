

const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../common-middleware/index');
const { createProduct } = require('../controllers/product_controller');
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
//router.get('/product/getCategories', getCategories);


module.exports = router;
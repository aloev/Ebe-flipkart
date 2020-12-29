const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middleware/index');
const { addItemtoCart, getCartItems, removeCartItems  } = require('../controllers/cart_controller');

router.post('/user/cart/addtocart', requireSignin , userMiddleware, addItemtoCart );
router.post('/user/getCartItems', requireSignin , userMiddleware, getCartItems );
router.post('/user/cart/removeItem', requireSignin , userMiddleware, removeCartItems );

module.exports = router;
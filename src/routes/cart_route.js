const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middleware/index');
const { addItemtoCart  } = require('../controllers/cart_controller');

router.post('/user/cart/addtocart', requireSignin , userMiddleware, addItemtoCart );

module.exports = router;
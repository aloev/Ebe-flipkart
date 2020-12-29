const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middleware/index');
const { addOrder, getOrders , getOrder } = require('../controllers/order_controller');

router.post('/addOrder', requireSignin , userMiddleware, addOrder );
router.post('/getOrders', requireSignin , userMiddleware, getOrders );
router.post('/getOrder', requireSignin , userMiddleware, getOrder );

module.exports = router;
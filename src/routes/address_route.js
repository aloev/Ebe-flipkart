const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware/index');
const { getAddress, addAddress } = require('../controllers/address_controller');
const router = express.Router();

router.post('/user/address/create', requireSignin , userMiddleware, addAddress );
router.post('/user/getaddress', requireSignin , userMiddleware, getAddress );

module.exports = router;
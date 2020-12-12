

const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../common-middleware/index');
const { addCategory, getCategories } = require('../controllers/category_controller');

router.post('/category/create', requireSignin , adminMiddleware ,addCategory);
router.get('/category/getCategories', getCategories);


module.exports = router;
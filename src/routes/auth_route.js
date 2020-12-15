

const express = require('express');
const { requireSignin } = require('../common-middleware');
const router = express.Router();
const { signup, signin, signout } = require('../controllers/auth_controller');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth_validators');

router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', signout )

// router.post('/profile' , requireSigning)

module.exports = router;
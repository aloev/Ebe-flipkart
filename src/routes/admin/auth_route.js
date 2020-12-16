

const express = require('express');
const router = express.Router();
const { signup, signin } = 
    require('../../controllers/admin/auth_controller');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth_validators');


router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);

router.post('/admin/signup', validateSignupRequest,isRequestValidated, signup);

// router.post('/profile' , requireSigning)

module.exports = router;
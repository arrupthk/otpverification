const express = require('express');
const router = express.Router();
const loginC =require('../Controller/sign')

router.post('/signup', loginC.signUp);
router.post('/login',loginC.login);
router.post('/sendOtpVerification', loginC.login)
module.exports = router;
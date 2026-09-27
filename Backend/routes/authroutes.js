const express = require('express');
const {registeruser,  loginuser, verifyotp} = require('../controllers/authcontroller.js')
const router = express.Router();

router.post('/register', registeruser)
router.post('/login', loginuser);
router.post('/verify-otp', verifyotp);

module.exports = router
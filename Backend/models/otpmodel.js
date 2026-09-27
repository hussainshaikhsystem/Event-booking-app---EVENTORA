const mongoose = require('mongoose');
const otpschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
     otp : {
       type: String,
       required: true
    },
    action : {
        type: String,
        enum: ['account_verification', 'event_booking'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
        required: true
    }
});
module.exports = mongoose.model('Otp', otpschema)
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    expiresIn: {
        type: Date,
        default:Date.now
    }
});

//automatically delete OTP documents after 1 minute
otpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 60 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;

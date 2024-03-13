const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    idcardnumber: {
        type: String,
        unique: true
    },
    role: {
        type: String,
    },
    profilepicture: {
        type: String
    },
    class: {
        type: String
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
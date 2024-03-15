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
        default: "STUDENT"
    },
    profilepicture: {
        type: String
    },
    class: {
        type: String,
        default: "1",
        enum: ["1", "2", "3", "4", "5", "6", "7", "8"]
    },
    department: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
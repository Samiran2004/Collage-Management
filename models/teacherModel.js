const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
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
    subjectSpect: {
        type: String
    },
    role: {
        type: String,
        default: "TEACHER"
    },
    idcardnumber: {
        type: String,
        unique: true
    },
    profilepicture: {
        type: String
    }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
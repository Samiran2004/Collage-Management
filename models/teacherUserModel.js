const mongoose = require('mongoose');

const teacherUserSchema = new mongoose.Schema({
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
    specialist: {
        type: String,
        required: true
    },
    profilepicture: {
        type: String
    },
    idnumber: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type:String,
        default:"TEACHER"
    }
});

const TeacherUser = mongoose.model('TeacherUser', teacherUserSchema);
module.exports = TeacherUser;
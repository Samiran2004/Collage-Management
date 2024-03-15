const mongoose = require('mongoose');
const Student = require('../models/userModel');

const studentAttandenceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Student,
        required: true
    },
    isPresent: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Studentattandence = mongoose.model('StudentAttandence', studentAttandenceSchema);
module.exports = Studentattandence;
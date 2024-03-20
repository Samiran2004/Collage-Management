const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    bookidnumber: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    subject: {
        type: String
    },
    claim: [{
        name: String,
        idnumber: String,
        email: String
    }]
});

const Books = mongoose.model('Books', bookSchema);
module.exports = Books;
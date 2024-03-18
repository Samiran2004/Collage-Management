const Student = require('../models/userModel');
const Teacher = require('../models/teacherModel');
const Books = require('../models/bookModel');

const entryNewBook = async (req, res) => {
    const { bookname, author, subject } = req.body;
    let quantity = 1;
    try {
        if (!bookname || !author || !subject) {
            res.status(400).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            const checkExist = await Books.findOne({ name: bookname, author: author });
            if (!checkExist) {
                const bookidnumber = Math.floor(Math.random() * 10000) + 10000
                const newBook = new Books({
                    name: bookname,
                    author: author,
                    subject: subject,
                    bookidnumber: bookidnumber,
                    quantity: quantity
                });
                const result = await newBook.save();
                res.status(201).send({
                    status: "Success",
                    bookdata: result
                });
            } else {
                quantity = checkExist.quantity;
                checkExist.quantity = quantity + 1
                const result = await checkExist.save();
                res.status(201).send({
                    status: "Success",
                    result
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error",
        });
    }
}

const getAllBooksBySubject = async (req, res) => {
    const { subject, author, bookidnumber } = req.params;
    console.log(subject, author, bookidnumber);
    try {
        if (!subject) {
            res.status(400).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            let query = { subject: subject };
            // Add author filter to the query if author is provided
            if (author) {
                query.author = author;
            }
            // Add bookidnumber filter to the query if bookidnumber is provided
            if (bookidnumber) {
                query.bookidnumber = bookidnumber;
            }
            // Fetch books based on the constructed query
            const data = await Books.find(query);
            // Send response with fetched data
            res.status(200).json({
                status: "Success",
                data: data
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error."
        });
    }
}

const claimBook = async (req, res) => {
    const { bookname, author, idnumber, role } = req.body;
    try {
        if (!bookname || !author || !idnumber || !role) {
            res.status(400).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        });
    }
}

module.exports = {
    entryNewBook,
    getAllBooksBySubject,
    claimBook
}
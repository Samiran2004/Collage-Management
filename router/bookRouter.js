const express = require('express');
const {
    entryNewBook,
    getAllBooksBySubject,
    claimBook
} = require('../controller/bookController');
const router = express.Router();

//Entry new book..
router.post('/entry-new-book', entryNewBook);

router.get('/get-all-books/:subject/:author?/:bookidnumber?', getAllBooksBySubject);

router.post('/claim-book',claimBook);
module.exports = router;
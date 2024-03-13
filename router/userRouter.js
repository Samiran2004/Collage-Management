const express = require('express');
const router = express.Router();

const {
    signupStudent,
    signupTeacher
} = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');

router.post('/signup-student', upload.single("profilepicture"), signupStudent);
router.post('/signup-teacher', upload.single("profilepicture"), signupTeacher);

module.exports = router;
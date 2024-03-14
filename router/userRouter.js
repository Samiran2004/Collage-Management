const express = require('express');
const router = express.Router();

const {
    signupStudent,
    signupTeacher,
    login
} = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');

router.post('/signup-student', upload.single("profilepicture"), signupStudent);
router.post('/signup-teacher', upload.single("profilepicture"), signupTeacher);

router.get('/login', login);

module.exports = router;
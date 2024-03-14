const express = require('express');
const router = express.Router();

const {
    signupStudent,
    signupTeacher,
    login,
    getUserData
} = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');
const authentication = require('../middleware/authenticationMiddleware');

router.post('/signup-student', upload.single("profilepicture"), signupStudent);
router.post('/signup-teacher', upload.single("profilepicture"), signupTeacher);

router.get('/login', login);

router.get('/get-user-detials', authentication, getUserData);

module.exports = router;
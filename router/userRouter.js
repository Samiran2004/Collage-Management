const express = require('express');
const router = express.Router();

const {
    signupStudent,
    login,
    getUserData,
    getUserById,
    getAllStudent,
} = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');
const authentication = require('../middleware/authenticationMiddleware');

router.post('/signup-student', upload.single("profilepicture"), signupStudent);

router.get('/login', login);

router.get('/get-user-detials', authentication, getUserData);
router.get('/get-user/:id', getUserById);

router.get('/get-all-students/:sem/:department', getAllStudent);

module.exports = router;
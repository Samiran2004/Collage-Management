const express = require('express');
const router = express.Router();

const {
    signupStudent,
    login,
    getUserData,
    getUserById,
    getAllStudent,
    updateStudent,
    deleteStudent,
    sendOtp,
    verifyOtp,
} = require('../controller/userController');
const upload = require('../middleware/multerMiddleware');
const authentication = require('../middleware/authenticationMiddleware');

router.post('/signup-student', upload.single("profilepicture"), signupStudent);

router.get('/login', login);

router.get('/get-user-detials', authentication, getUserData);
router.get('/get-user/:id', getUserById);

router.get('/get-all-students/:sem/:department', getAllStudent);

router.patch('/update/:idcardnumber', authentication, upload.single("profilepicture"), updateStudent);

router.delete('/delete/:idcardnumber', authentication,deleteStudent);

router.post('/send-otp',sendOtp);

router.post('/verify', verifyOtp);

module.exports = router;
const express = require('express');
const { signup, login, getTeacherDetials, getTeacherById, getAllTeacherBySpec, getAllTeacher } = require('../controller/teacherController');
const upload = require('../middleware/multerMiddleware');
const authentication = require('../middleware/authenticationMiddleware');
const router = express.Router();

router.post('/signup', upload.single("profilepicture"), signup);

router.get('/login', login);
router.get('/get-detials', authentication, getTeacherDetials);
router.get('/get-detials/:idcardnumber', getTeacherById);
router.get('/get-detials-spec/:spec', getAllTeacherBySpec);
router.get('/get-all', getAllTeacher);

module.exports = router;
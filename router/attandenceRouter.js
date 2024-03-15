const express = require('express');
const { studentAttandence, getStudentAttandence } = require('../controller/attandenceController');
const router = express.Router();

router.post('/student', studentAttandence);
router.get('/student/:studentId', getStudentAttandence);

module.exports = router;
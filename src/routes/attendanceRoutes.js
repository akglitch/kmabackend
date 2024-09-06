const express = require('express');

const router = express.Router();
const {markAttendance,getAttendanceReport,getTotalAttendance} = require('../controllers/attendanceController');


// Routes for attendance
router.post('/mark', markAttendance);
router.get('/total', getTotalAttendance);
router.get('/report', getAttendanceReport);

module.exports = router;
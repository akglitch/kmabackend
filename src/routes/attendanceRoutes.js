const express = require('express');

const router = express.Router();
const {markAttendance,getAttendanceReport,deleteAllAttendance,getTotalAttendance} = require('../controllers/attendanceController');


// Routes for attendance
router.post('/mark', markAttendance);
router.get('/total', getTotalAttendance);
router.get('/report', getAttendanceReport);
router.delete('/subattendance/deleteAll',deleteAllAttendance);

module.exports = router;

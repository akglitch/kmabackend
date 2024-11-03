// routes/convenerMeetingRoutes.js

const express = require('express');
const router = express.Router();
const { recordConvenerMeetingAttendance,getTotalConveners,getTotalAttendance, deleteAllAttendanceRecords, fetchConvenerAttendanceReport,fetchConveners } = require('../controllers/convenerMeetingController');

router.post('/convener-meeting/attendance', recordConvenerMeetingAttendance);
router.get('/conveners', fetchConveners);
router.get('/execoreport', fetchConvenerAttendanceReport);
router.delete('/attendance/deleteAll', deleteAllAttendanceRecords);
router.get('/totalconveners', getTotalConveners);
router.get('/totalconvenerattendance', getTotalAttendance);



module.exports = router;

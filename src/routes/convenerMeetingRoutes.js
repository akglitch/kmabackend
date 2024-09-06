// routes/convenerMeetingRoutes.js

const express = require('express');
const router = express.Router();
const { recordConvenerMeetingAttendance,fetchConvenerAttendanceReport,fetchConveners } = require('../controllers/convenerMeetingController');

router.post('/convener-meeting/attendance', recordConvenerMeetingAttendance);
router.get('/conveners', fetchConveners);
router.get('/', fetchConvenerAttendanceReport);



module.exports = router;

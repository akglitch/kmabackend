// routes/generalMeetingRoutes.js

const express = require('express');
const router = express.Router();
const { recordGeneralMeetingAttendance,fetchAllMembers,deleteAllGeneralMeetingAttendance,generateAttendanceReport } = require('../controllers/generalMeetingController');

router.post('/general-meeting/attendance', recordGeneralMeetingAttendance);
router.get('/generalmembers', fetchAllMembers);
router.get('/generalreport', generateAttendanceReport);
router.delete('/generalMeeting/attendance/deleteAll', deleteAllGeneralMeetingAttendance);




module.exports = router;

// routes/generalMeetingRoutes.js

const express = require('express');
const router = express.Router();
const { recordGeneralMeetingAttendance,fetchAllMembers,generateAttendanceReport } = require('../controllers/generalMeetingController');

router.post('/general-meeting/attendance', recordGeneralMeetingAttendance);
router.get('/generalmembers', fetchAllMembers);
router.get('/generalreport', generateAttendanceReport);




module.exports = router;

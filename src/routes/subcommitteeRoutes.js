const express = require('express');
const { searchMembers, markAttendance,getTotalAttendance,getAttendanceReport, addMemberToSubcommittee, initializeSubcommittees, getSubcommittees } = require('../controller/subcommitteesController');

const router = express.Router();

router.post('/search', searchMembers);
router.post('/subcommittees/addmember', addMemberToSubcommittee);
router.get('/initialize', initializeSubcommittees);
router.get('/subcommittees', getSubcommittees);
router.post('/attendance', markAttendance); // New route for marking attendance
router.get('/attendance/total',getTotalAttendance)
router.get('/report',)

module.exports = router;

module.exports.initializeSubcommittees = initializeSubcommittees


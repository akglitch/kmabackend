const express = require('express');
const { searchMembers, deleteAllAttendance,deleteMember,fetchAllMembers, editMember } = require('../controllers/membersController');

const router = express.Router();

// Fetch all members
router.get('/allmembers', fetchAllMembers);
// Search members by contact
router.get('/search', searchMembers);

router.delete('/attendance/deleteAll',deleteAllAttendance);

// Delete a member by ID
router.delete('/members/:memberType/:memberId', deleteMember);

// Edit a member by ID
router.put('/:memberType/:id', editMember);

module.exports = router;
   
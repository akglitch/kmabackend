const express = require('express');
const { searchMembers,deleteMemberFromSubcommittee,addMemberToSubcommittee, initializeSubcommittees, getSubcommittees } = require('../controllers/subcommitteesController');

const router = express.Router();

// Routes for subcommittees and members
router.get('/initialize',initializeSubcommittees);
router.get('/subcommittees',getSubcommittees);
router.post('/subcommittees/addmember', addMemberToSubcommittee);
router.delete('/subcommittees/:subcommitteeId/members/:memberId', deleteMemberFromSubcommittee);
router.post('/search', searchMembers);
module.exports = router;

module.exports.initializeSubcommittees = initializeSubcommittees


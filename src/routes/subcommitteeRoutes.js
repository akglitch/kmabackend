const express = require('express');
const { searchMembers, addMemberToSubcommittee, initializeSubcommittees, getSubcommittees } = require('../controller/subcommitteesController');

const router = express.Router();

router.post('/search', searchMembers);
router.post('/subcommittees/addmember', addMemberToSubcommittee);
router.get('/initialize', initializeSubcommittees);
router.get('/subcommittees', getSubcommittees);

module.exports = router;

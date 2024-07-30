const express = require('express');
const router = express.Router();

// Import controller functions
const { createMember, getMembers } = require('../controller/assemblyMembersController');

// Define routes
router.post('/assemblymember', createMember);
router.get('/assemblymembers', getMembers);

module.exports = router;

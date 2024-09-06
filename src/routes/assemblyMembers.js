const express = require('express');
const router = express.Router();

// Import controller functions
const { createMember, getMembers, getTotalAssemblyMembers } = require('../controllers/assemblyMembersController');

// Define routes
router.post('/assemblymember', createMember);
router.get('/assemblymembers', getMembers);
router.get('/assembly/members/total',getTotalAssemblyMembers)

module.exports = router;

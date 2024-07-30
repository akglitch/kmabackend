const express = require('express');
const subcommitteeRoutes = require('./subcommitteeRoutes');
const memberRoutes = require('./memberRoutes');

const router = express.Router();

// Use routes
router.use('/subcommittees', subcommitteeRoutes);
router.use('/members', memberRoutes);

module.exports = router;

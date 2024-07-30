const express = require('express');
const { addAppointee, getAppointees } = require('../controller/governmentAppointeesController');

const router = express.Router();

// Define routes
router.post('/appointee', addAppointee);
router.get('/appointees', getAppointees);

module.exports = router;

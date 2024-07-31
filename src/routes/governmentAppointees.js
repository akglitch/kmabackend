const express = require('express');
const router = express.Router();

const { addAppointee, getAppointees } = require('../controller/governmentAppointeesController');



// Define routes
router.post('/appointee', addAppointee);
router.get('/appointees', getAppointees);

module.exports = router;

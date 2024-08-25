const express = require('express');
const router = express.Router();

const { addAppointee, getAppointees,getTotalGovernmentAppointees } = require('../controller/governmentAppointeesController');



// Define routes
router.post('/appointee', addAppointee);
router.get('/appointees', getAppointees);
router.get('/governmentAppointees/total',getTotalGovernmentAppointees);


module.exports = router;

const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetingsController');

// Route to create a new meeting
// POST /api/meetings/create
router.post('/meetings/create', meetingsController.createMeeting); // Added leading slash

// Route to get all meetings
// GET /api/meetings
router.get('/meetings', meetingsController.getAllMeetings);

// Route to get a specific meeting by its ID
// GET /api/meetings/:id
router.get('/meetings/:id', meetingsController.getMeetingById);

// Route to update meeting by ID (minutes or entire meeting)
// PUT /api/meetings/:id
router.put('/meetings/:id', meetingsController.updateMeeting); // Changed the route to match the frontend expectation

module.exports = router;

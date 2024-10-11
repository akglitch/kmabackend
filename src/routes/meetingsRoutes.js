// routes/meetings.js

const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetingsController');

// Route to create a new meeting
// POST /api/meetings/create
router.post('/create', meetingsController.createMeeting);

// Route to get all meetings
// GET /api/meetings
router.get('/meetings', meetingsController.getAllMeetings);

// Route to get a specific meeting by its ID
// GET /api/meetings/:id
router.get('/:id', meetingsController.getMeetingById);

// Route to update meeting minutes by meeting ID
// PUT /api/meetings/:id/update-minutes
router.put('/:id/update-minutes', meetingsController.updateMeetingMinutes);

module.exports = router;

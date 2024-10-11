const Meeting = require('../models/Meeting');

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, date, minutes, createdBy } = req.body;  // Removed `attendees`
    const meeting = new Meeting({ title, date, minutes, createdBy });
    await meeting.save();
    res.status(201).json({ success: true, message: 'Meeting created successfully', meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('createdBy', 'name');  // Removed `attendees`
    res.status(200).json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// Get a specific meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('createdBy', 'name');  // Removed `attendees`
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.status(200).json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// Update meeting minutes
exports.updateMeeting = async (req, res) => {
  try {
    const { minutes, title, date } = req.body; // Example fields
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    meeting.title = title || meeting.title;
    meeting.minutes = minutes || meeting.minutes;
    meeting.date = date || meeting.date;

    await meeting.save();
    res.status(200).json({ success: true, message: 'Meeting updated successfully', meeting });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating meeting', error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    await meeting.remove();
    res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting meeting', error: err.message });
  }
};


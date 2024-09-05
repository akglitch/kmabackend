// models/GeneralMeetingAttendance.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneralMeetingAttendanceSchema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attended: {
    type: Boolean,
    default: false,
  },
});

const GeneralMeetingAttendance = mongoose.model('GeneralMeetingAttendance', GeneralMeetingAttendanceSchema);
module.exports = GeneralMeetingAttendance;

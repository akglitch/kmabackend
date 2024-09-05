const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConvenerAttendanceSchema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Save the time of submission
  },
});

const ConvenerAttendance = mongoose.model('ConvenerAttendance', ConvenerAttendanceSchema);
module.exports = ConvenerAttendance;

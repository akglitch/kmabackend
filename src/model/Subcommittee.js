const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  date: { type: Date, default: Date.now }
});

const memberSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  memberType: String,
  name: String,
  meetingsAttended: Number,
  totalAmount: Number,
  isConvener: Boolean
});

const subcommitteeSchema = new mongoose.Schema({
  name: String,
  members: [memberSchema],
  attendance: [attendanceSchema]
});

module.exports = mongoose.model('Subcommittee', subcommitteeSchema);

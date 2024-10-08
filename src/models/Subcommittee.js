const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  memberType: String,
  name: String,
  meetingsAttended: Number,
  totalAmount: Number,
  isConvener: { type: Boolean, default: false } 
});

const subcommitteeSchema = new mongoose.Schema({
  name: String,
  members: [memberSchema],
});

module.exports = mongoose.model('Subcommittee', subcommitteeSchema);

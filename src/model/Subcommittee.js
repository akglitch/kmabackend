const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the schema for a Subcommittee member
const memberSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, required: true },
  memberType: { type: String, enum: ['AssemblyMember', 'GovernmentAppointee'], required: true },
  name: { type: String, required: true }
});

// Define the schema for a Subcommittee
const subcommitteeSchema = new Schema({
  name: { type: String, required: true },
  members: [memberSchema]
});

// Create and export the Subcommittee model
const Subcommittee = model('Subcommittee', subcommitteeSchema);
module.exports = Subcommittee;

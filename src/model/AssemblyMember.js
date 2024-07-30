const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssemblyMemberSchema = new Schema({
  name: { type: String, required: true },
  electoralArea: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  gender: { type: String, required: true }
});

const AssemblyMember = mongoose.model('AssemblyMember', AssemblyMemberSchema);
module.exports = AssemblyMember;

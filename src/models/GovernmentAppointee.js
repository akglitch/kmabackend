const mongoose = require('mongoose');
const { Schema } = mongoose;

const GovernmentAppointeeSchema = new Schema({
  name: { type: String, required: true },
  electoralArea: { type: String, required: true }, // Ensure this matches your frontend
  contact: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  isConvener: { type: Boolean, default: false }
});

const GovernmentAppointee = mongoose.model('GovernmentAppointee', GovernmentAppointeeSchema);
module.exports = GovernmentAppointee;

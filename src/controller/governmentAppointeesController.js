const GovernmentAppointee = require('../model/GovernmentAppointee');

const addAppointee = async (req, res) => {
  const {  name, contact, gender, electoralArea, isConvener } = req.body;
  const newAppointee = new GovernmentAppointee({  name, contact, gender, electoralArea, isConvener });
  try {
    const savedAppointee = await newAppointee.save();
    res.status(201).json(savedAppointee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointee' });
  }
};

const getAppointees = async (req, res) => {
  try {
    const appointees = await GovernmentAppointee.find();
    res.status(200).json(appointees);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching appointees' });
  }
};

module.exports = {
  addAppointee,
  getAppointees
};

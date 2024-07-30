
const AssemblyMember = require('../model/AssemblyMember'); // Adjust the import path according to your project structure

const createMember = async (req, res) => {
  const newMember = new AssemblyMember(req.body);
  try {
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating record:', error); // Log the error details
    res.status(400).json({ message: 'Error creating record', error: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await AssemblyMember.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMember,
  getMembers
};

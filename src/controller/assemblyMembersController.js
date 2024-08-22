const AssemblyMember = require('../model/AssemblyMember');

const createMember = async (req, res) => {
  const { name, contact, gender, electoralArea, isConvener } = req.body;
  const newMember = new AssemblyMember({ name, contact, gender, electoralArea, isConvener });
  try {
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating record:', error);
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

const Subcommittee = require('../models/Subcommittee'); // Ensure correct path
const AssemblyMember = require('../models/AssemblyMember'); // Ensure correct path
const GovernmentAppointee = require('../models/GovernmentAppointee'); // Ensure correct path

const subcommittees = ['Travel', 'Revenue', 'Transport'];

const initializeSubcommittees = async () => {
  try {
    for (const name of subcommittees) {
      const existingSubcommittee = await Subcommittee.findOne({ name });
      if (!existingSubcommittee) {
        await Subcommittee.create({ name, members: [] });
      }
    }
    console.log('Subcommittees initialized successfully');
  } catch (error) {
    console.error('Error initializing subcommittees:', error);
    throw error;
  }
};

const getSubcommittees = async (req, res) => {
  try {
    const subcommittees = await Subcommittee.find();
    res.status(200).json(subcommittees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcommittees' });
  }
};

const addMemberToSubcommittee = async (req, res) => {
  const { subcommitteeName, memberId, memberType, isConvener } = req.body;

  try {
    // Find the subcommittee by name
    const subcommittee = await Subcommittee.findOne({ name: subcommitteeName });
    if (!subcommittee) {
      return res.status(404).send({ message: 'Subcommittee not found' });
    }

    // Retrieve the member based on their type
    let member;
    if (memberType === 'AssemblyMember') {
      member = await AssemblyMember.findById(memberId);
    } else if (memberType === 'GovernmentAppointee') {
      member = await GovernmentAppointee.findById(memberId);
    }

    if (!member) {
      return res.status(404).send({ message: 'Member not found' });
    }

    // Fetch all subcommittees the member is part of
    const existingSubcommittees = await Subcommittee.find({
      'members.memberId': memberId,
    });

    // Check if the member is already a convener in any subcommittee
    const existingSubcommitteesWithConvener = existingSubcommittees.filter(sub =>
      sub.members.some(m => m.memberId.toString() === memberId && m.isConvener)
    );

    // Restrict being a convener to only one subcommittee
    if (isConvener && existingSubcommitteesWithConvener.length > 0) {
      return res.status(400).send({ message: 'A convener can only be a convener in one subcommittee' });
    }

    // Ensure no other convener is in this subcommittee
    const existingConvener = subcommittee.members.some(
      m => m.isConvener
    );

    if (isConvener && existingConvener) {
      return res.status(400).send({ message: 'This subcommittee already has a convener' });
    }

    // If the member is already a convener in another subcommittee, make them an ordinary member here
    if (existingSubcommitteesWithConvener.length > 0) {
      isConvener = false;
    }

    // Check if the member is already part of this subcommittee
    const isMemberAlreadyInSubcommittee = subcommittee.members.some(
      (m) => m.memberId.toString() === memberId && m.memberType === memberType
    );

    if (isMemberAlreadyInSubcommittee) {
      return res.status(400).send({ message: 'Member is already in this subcommittee' });
    }

    // Add the member to the subcommittee with the appropriate role
    subcommittee.members.push({
      memberId,
      memberType,
      name: member.name,
      isConvener, // Convener flag will be false if already a convener elsewhere
    });

    // Save the updated subcommittee
    await subcommittee.save();

    res.status(200).send(subcommittee);
  } catch (error) {
    console.error('Error in addMemberToSubcommittee:', error);
    res.status(500).send({ message: 'An unexpected error occurred' });
  }
};




const deleteMemberFromSubcommittee = async (req, res) => {
  try {
    const { subcommitteeId, memberId } = req.params;

    await Subcommittee.findByIdAndUpdate(
      subcommitteeId,
      { $pull: { members: { memberId } } },
      { new: true }
    );

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member' });
  }
};

const searchMembers = async (req, res) => {
  const { contact } = req.query;

  try {
    const assemblyMembers = await AssemblyMember.find({ contact: { $regex: contact, $options: 'i' } });
    const governmentAppointees = await GovernmentAppointee.find({ contact: { $regex: contact, $options: 'i' } });

    const members = [...assemblyMembers, ...governmentAppointees];

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error searching members', error });
  }
};

module.exports = {
  initializeSubcommittees,
  getSubcommittees,
  addMemberToSubcommittee,
  deleteMemberFromSubcommittee,
  searchMembers,
};

const Subcommittee = require('../model/Subcommittee');  // Ensure correct path to Subcommittee model
const AssemblyMember = require('../model/AssemblyMember');  // Ensure correct path to AssemblyMember model
const GovernmentAppointee = require('../model/GovernmentAppointee');  // Ensure correct path to GovernmentAppointee model

const subcommittees = ['Travel', 'Revenue', 'Transport'];

const initializeSubcommittees = async (req, res) => {
  try {
    for (const name of subcommittees) {
      const existingSubcommittee = await Subcommittee.findOne({ name });
      if (!existingSubcommittee) {
        await Subcommittee.create({ name, members: [] });
      }
    }
    res.status(200).send({ message: 'Subcommittees initialized successfully' });
  } catch (error) {
    console.error('Error initializing subcommittees:', error);
    res.status(500).send({ message: 'Error initializing subcommittees' });
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
  const { subcommitteeName, memberId, memberType } = req.body;

  try {
    // Check if the subcommittee exists
    const subcommittee = await Subcommittee.findOne({ name: subcommitteeName });
    if (!subcommittee) {
      res.status(404).send({ message: 'Subcommittee not found' });
      return;
    }

    // Find the member
    let member;
    if (memberType === 'AssemblyMember') {
      member = await AssemblyMember.findById(memberId);
    } else if (memberType === 'GovernmentAppointee') {
      member = await GovernmentAppointee.findById(memberId);
    }

    if (!member) {
      res.status(404).send({ message: 'Member not found' });
      return;
    }

    // Check if the member is already in any subcommittee
    const existingSubcommittee = await Subcommittee.findOne({
      'members.memberId': memberId,
    });

    if (existingSubcommittee && existingSubcommittee.name !== subcommitteeName) {
      res.status(400).send({ message: 'Member is already in another subcommittee' });
      return;
    }

    // Check if the member is already in the specified subcommittee
    const isMemberAlreadyInSubcommittee = subcommittee.members.some(
      (subMember) => subMember.memberId.toString() === memberId
    );

    if (isMemberAlreadyInSubcommittee) {
      res.status(400).send({ message: 'Member is already in this subcommittee' });
      return;
    }

    // Add the member to the subcommittee
    subcommittee.members.push({
      memberId,
      memberType,
      name: member.name,
    });

    await subcommittee.save();
    res.status(200).send(subcommittee);
  } catch (error) {
    res.status(500).send({ message: error.message });
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
  searchMembers
};

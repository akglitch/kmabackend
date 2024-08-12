const Subcommittee = require('../model/Subcommittee');  // Ensure correct path to Subcommittee model
const AssemblyMember = require('../model/AssemblyMember');  // Ensure correct path to AssemblyMember model
const GovernmentAppointee = require('../model/GovernmentAppointee');  // Ensure correct path to GovernmentAppointee model


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
    throw error; // Rethrow error to handle it in the calling function
  }
};

const amountPerMeeting = 100;

const markAttendance = async (req, res) => {
  const { subcommitteeId, memberId } = req.body;

  try {
    // Find the subcommittee by ID
    const subcommittee = await Subcommittee.findById(subcommitteeId);
    if (!subcommittee) {
      return res.status(404).json({ message: 'Subcommittee not found' });
    }

    // Find the member within the subcommittee
    const member = subcommittee.members.find(
      (m) => m.memberId.toString() === memberId
    );
    if (!member) {
      return res.status(404).json({ message: 'Member not found in subcommittee' });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    // Check if attendance was already marked today
    if (member.lastAttendanceDate === today) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    // Increment the meetingsAttended
    member.meetingsAttended = (member.meetingsAttended || 0) + 1;

    // Set the lastAttendanceDate to today
    member.lastAttendanceDate = today;

    // Calculate the total amount due for the member
    const totalAmount = member.meetingsAttended * amountPerMeeting;

    // Save the updated subcommittee document
    await subcommittee.save();

    res.status(200).json({ 
      message: 'Attendance marked successfully', 
      subcommittee,
      totalAmount // Include the calculated amount in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
      return res.status(404).send({ message: 'Subcommittee not found' });
    }

    // Find the member based on memberType
    let member;
    if (memberType === 'AssemblyMember') {
      member = await AssemblyMember.findById(memberId);
    } else if (memberType === 'GovernmentAppointee') {
      member = await GovernmentAppointee.findById(memberId);
    }

    if (!member) {
      return res.status(404).send({ message: 'Member not found' });
    }

    // Check how many subcommittees the member is already in
    const existingSubcommittees = await Subcommittee.find({
      'members.memberId': memberId,
    });

    // Ensure the member is not in more than 2 subcommittees
    if (existingSubcommittees.length >= 2) {
      return res.status(400).send({ message: 'Member is already in 2 subcommittees' });
    }

    // Check if the member is already in the specified subcommittee
    const isMemberAlreadyInSubcommittee = subcommittee.members.some(
      (sub) => sub.memberId.toString() === memberId && sub.memberType === memberType
    );

    if (isMemberAlreadyInSubcommittee) {
      return res.status(400).send({ message: 'Member is already in this subcommittee' });
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
    console.error(error);
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
  searchMembers,
  markAttendance,
};

const Subcommittee = require('../model/Subcommittee');  // Ensure correct path to Subcommittee model
const AssemblyMember = require('../model/AssemblyMember');  // Ensure correct path to AssemblyMember model
const GovernmentAppointee = require('../model/GovernmentAppointee');  // Ensure correct path to GovernmentAppointee model
const { amountPerMeeting, convenerBonus } = require('../config/constants');

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

const getTotalAttendance = async (req, res) => {
  try {
    const subcommittees = await Subcommittee.find();
    let totalAttendance = 0;

    subcommittees.forEach(subcommittee => {
      totalAttendance += subcommittee.attendance.length;
    });

    res.status(200).json({ total: totalAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total attendance', error: error.message });
  }
};


const markAttendance = async (req, res) => {
  const { subcommitteeId, memberId, convener } = req.body;

  try {
    const subcommittee = await Subcommittee.findById(subcommitteeId);
    if (!subcommittee) {
      return res.status(404).json({ message: 'Subcommittee not found' });
    }

    const member = subcommittee.members.find(
      (m) => m.memberId.toString() === memberId
    );
    if (!member) {
      return res.status(404).json({ message: 'Member not found in subcommittee' });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendanceAlreadyMarked = subcommittee.attendance.some(record => 
      record.memberId.toString() === memberId &&
      record.date >= startOfDay &&
      record.date <= endOfDay
    );

    if (attendanceAlreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    if (convener) {
      // Check if the member is a convener in any other subcommittee
      const otherSubcommittees = await Subcommittee.find({
        _id: { $ne: subcommitteeId },
        'members.memberId': memberId,
        'members.isConvener': true,
      });

      if (otherSubcommittees.length > 0) {
        return res.status(400).json({ message: 'Member is already a convener in another subcommittee' });
      }

      member.isConvener = true;
    } else {
      member.isConvener = false;
    }

    // Add attendance record
    subcommittee.attendance.push({ memberId, date: new Date() });

    // Update member stats
    member.meetingsAttended = (member.meetingsAttended || 0) + 1;
    member.totalAmount = member.meetingsAttended * amountPerMeeting +
      (member.isConvener ? convenerBonus : 0);

    await subcommittee.save();

    res.status(200).json({
      message: 'Attendance marked successfully',
      member: {
        meetingsAttended: member.meetingsAttended,
        totalAmount: member.totalAmount,
      },
    });
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const subcommittees = await Subcommittee.find();
    console.log("Fetched subcommittees:", subcommittees); // Debugging log

    const reportData = subcommittees.map(subcommittee => ({
      subcommitteeName: subcommittee.name,
      members: subcommittee.members.map(member => ({
        name: member.name,
        meetingsAttended: member.meetingsAttended || 0,
        totalAmount: member.totalAmount || 0,
        isConvener: member.isConvener || false
      }))
    }));

    console.log("Report data:", reportData); // Debugging log

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error); // Debugging log
    res.status(500).json({ message: 'Error generating report', error: error.message });
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
  getTotalAttendance,
  markAttendance,
  getAttendanceReport,
};

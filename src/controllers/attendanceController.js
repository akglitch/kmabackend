const Subcommittee = require('../models/Subcommittee'); // Ensure correct path
const Attendance = require('../models/Attendance'); // Ensure correct path
const { amountPerMeeting, convenerBonus } = require('../config/constants');

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

    // Check if attendance has already been marked today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendanceAlreadyMarked = await Attendance.findOne({
      memberId,
      subcommitteeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (attendanceAlreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    // Mark attendance for the current day
    const attendance = new Attendance({
      memberId,
      subcommitteeId,
      date: new Date()
    });
    await attendance.save();

    // Update the member's meeting attendance count and total amount
    member.meetingsAttended = (member.meetingsAttended || 0) + 1;
    member.totalAmount = member.meetingsAttended * amountPerMeeting +
      (member.isConvener ? convenerBonus : 0);

    await subcommittee.save();

    // Adjust convener status in other subcommittees
    const otherSubcommittees = await Subcommittee.find({
      _id: { $ne: subcommitteeId },
      'members.memberId': memberId,
    });

    for (const otherSubcommittee of otherSubcommittees) {
      const otherMember = otherSubcommittee.members.find(
        (m) => m.memberId.toString() === memberId
      );

      if (otherMember && otherMember.isConvener) {
        otherMember.isConvener = false;
        await otherSubcommittee.save();
      }
    }

    // Respond with success and updated member information
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
    const reportData = subcommittees.map(subcommittee => ({
      subcommitteeName: subcommittee.name,
      members: subcommittee.members.map(member => ({
        name: member.name,
        meetingsAttended: member.meetingsAttended || 0,
        totalAmount: member.totalAmount || 0,
        isConvener: member.isConvener || false
      }))
    }));

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

const getTotalAttendance = async (req, res) => {
  try {
    const subcommittees = await Subcommittee.find();
    let totalAttendance = 0;

    for (const subcommittee of subcommittees) {
      const attendanceCount = await Attendance.countDocuments({
        subcommitteeId: subcommittee._id
      });
      totalAttendance += attendanceCount;
    }

    res.status(200).json({ total: totalAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total attendance', error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceReport,
  getTotalAttendance,
};

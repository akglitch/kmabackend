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
    const memberInSubcommittee = subcommittee.members.find(
      (m) => m.memberId.toString() === memberId
    );
    if (!memberInSubcommittee) {
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
      date: new Date(),
    });
    await attendance.save();

    // Update the member's meeting attendance count and total amount in the current subcommittee
    memberInSubcommittee.meetingsAttended = (memberInSubcommittee.meetingsAttended || 0) + 1;
    memberInSubcommittee.totalAmount = memberInSubcommittee.meetingsAttended * amountPerMeeting +
      (memberInSubcommittee.isConvener ? convenerBonus : 0);

    await subcommittee.save();

    // Find all subcommittees where this member is involved
    const allSubcommittees = await Subcommittee.find({
      'members.memberId': memberId,
    });

    for (const sub of allSubcommittees) {
      const memberInOtherSubcommittee = sub.members.find(
        (m) => m.memberId.toString() === memberId
      );

      if (memberInOtherSubcommittee && memberInOtherSubcommittee.isConvener) {
        // Preserve convener status in subcommittees where the member is a convener
        memberInOtherSubcommittee.isConvener = true; // Ensure convener status is not changed
        await sub.save();
      }
    }

    // Respond with success and updated member information
    res.status(200).json({
      message: 'Attendance marked successfully',
      member: {
        meetingsAttended: memberInSubcommittee.meetingsAttended,
        totalAmount: memberInSubcommittee.totalAmount,
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


const deleteAllAttendance = async (req, res) => {
  try {
    await Attendance.deleteMany({}); // Delete all documents in the Attendance collection
    res.status(200).json({ message: 'All attendance records have been deleted successfully' });
  } catch (error) {
    console.error("Error deleting attendance records:", error);
    res.status(500).json({ message: 'Error deleting attendance records', error: error.message });
  }
};


module.exports = {
  deleteAllAttendance,
  markAttendance,
  getAttendanceReport,
  getTotalAttendance,
};

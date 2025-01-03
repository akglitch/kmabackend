// controllers/convenerMeetingController.js
const AssemblyMember = require('../models/AssemblyMember');
const GovernmentAppointee = require('../models/GovernmentAppointee');
const ConvenerMeetingAttendance = require('../models/ConvenerMeetingAttendance');

const recordConvenerMeetingAttendance = async (req, res) => {
  try {
    const { members } = req.body;
    
    const currentTime = new Date();
    
    for (const member of members) {
      const existingAttendance = await ConvenerMeetingAttendance.findOne({
        memberId: member.memberId,
        timestamp: { $gte: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000) }
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          message: `Attendance for member ${member.memberId} has already been recorded within the last 24 hours.` 
        });
      }
    }

    const attendanceRecords = members.map(member => ({
      memberId: member.memberId,
      attended: member.attended,
      timestamp: currentTime
    }));

    await ConvenerMeetingAttendance.insertMany(attendanceRecords);

    res.status(200).send({ message: 'Convener meeting attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording convener meeting attendance:', error);
    res.status(500).send({ message: 'An error occurred while recording convener meeting attendance' });
  }
};
const fetchConvenerAttendanceReport = async (req, res) => {
  try {
    const attendanceRecords = await ConvenerMeetingAttendance.find();

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    // Fetch member names based on memberId type (AssemblyMember or GovernmentAppointee)
    const reportData = await Promise.all(
      attendanceRecords.map(async (record) => {
        let memberName = 'Unknown'; // Default name if no member is found

        // Try to fetch from AssemblyMember first
        let member = await AssemblyMember.findById(record.memberId).select('name');

        // If not found in AssemblyMember, try GovernmentAppointee
        if (!member) {
          member = await GovernmentAppointee.findById(record.memberId).select('name');
        }

        // If a member is found, set the name
        if (member) {
          memberName = member.name;
        }

        return {
          name: memberName,
          attended: record.attended ? 'Present' : 'Absent',
          timestamp: record.timestamp,
        };
      })
    );

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error fetching attendance report:', error.message, error.stack);
    res.status(500).send({ message: 'An error occurred while fetching the attendance report' });
  }
};


const fetchConveners = async (req, res) => {
  try {
    // Fetch all Assembly Members who are conveners
    const assemblyConveners = await AssemblyMember.find({ isConvener: true });

    // Fetch all Government Appointees who are conveners
    const governmentConveners = await GovernmentAppointee.find({ isConvener: true });

    // Combine the two lists of conveners
    const conveners = [...assemblyConveners, ...governmentConveners];

    res.status(200).json(conveners);
  } catch (error) {
    console.error('Error fetching conveners:', error);
    res.status(500).send({ message: 'An error occurred while fetching conveners' });
  }
};

const getTotalConveners = async (req, res) => {
  try {
    const assemblyConvenersCount = await AssemblyMember.countDocuments({ isConvener: true });
    const governmentConvenersCount = await GovernmentAppointee.countDocuments({ isConvener: true });

    const totalConveners = assemblyConvenersCount + governmentConvenersCount;
    res.status(200).json({ totalConveners });
  } catch (error) {
    console.error('Error fetching total conveners:', error);
    res.status(500).send({ message: 'An error occurred while fetching the total number of conveners' });
  }
};

const deleteAllAttendanceRecords = async (req, res) => {
  try {
    await ConvenerMeetingAttendance.deleteMany({}); // Deletes all records
    res.status(200).json({ message: 'All convener meeting attendance records deleted successfully' });
  } catch (error) {
    console.error('Error deleting all convener attendance records:', error);
    res.status(500).json({ message: 'An error occurred while deleting all convener attendance records' });
  }
};

const getTotalAttendance = async (req, res) => {
  try {
    // Count the number of attendance records where 'attended' is true
    const totalAttendanceCount = await ConvenerMeetingAttendance.countDocuments({ attended: true });
    
    res.status(200).json({ totalAttendance: totalAttendanceCount });
  } catch (error) {
    console.error('Error fetching total attendance:', error);
    res.status(500).json({ message: 'An error occurred while fetching total attendance' });
  }
};


module.exports = {
  getTotalAttendance,
  getTotalConveners,
  deleteAllAttendanceRecords,
  recordConvenerMeetingAttendance,
  fetchConveners,
  fetchConvenerAttendanceReport
};

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
    // Fetch attendance records and populate member details
    const attendanceRecords = await ConvenerMeetingAttendance.find()
      .populate('memberId', 'name'); // Ensure that memberId is being populated correctly

    // Map the results to the desired format
    const reportData = attendanceRecords.map(record => ({
      name: record.memberId ? record.memberId.name : 'Unknown', // Handle cases where memberId might not be populated
      attended: record.attended ? 'Present' : 'Absent',
      timestamp: record.timestamp,
    }));

    // Send the report data as a JSON response
    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
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
module.exports = {
  recordConvenerMeetingAttendance,
  fetchConveners,
  fetchConvenerAttendanceReport
};

const AssemblyMember = require('../models/AssemblyMember');
const GovernmentAppointee = require('../models/GovernmentAppointee');
const GeneralMeetingAttendance = require('../models/GeneralMeetingAttendance');

const recordGeneralMeetingAttendance = async (req, res) => {
  try {
    const { members } = req.body; // Array of { memberId, attended }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'No members provided for attendance' });
    }

    const currentTime = new Date();
    const attendees = members.filter(member => member.attended);

    if (attendees.length === 0) {
      return res.status(400).json({ message: 'No attendance marked. Please select attendance before submitting.' });
    }

    // Check if any of the attendees have submitted attendance within the last 24 hours
    for (const member of attendees) {
      const existingAttendance = await GeneralMeetingAttendance.findOne({
        memberId: member.memberId,
        date: { $gte: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          message: `Attendance for member ${member.memberId} has already been recorded within the last 24 hours.` 
        });
      }
    }

    // Record the new attendance
    const attendanceRecords = attendees.map(member => ({
      memberId: member.memberId,
      attended: member.attended,
      date: currentTime,
    }));

    await GeneralMeetingAttendance.insertMany(attendanceRecords);

    res.status(200).json({ message: 'General meeting attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording general meeting attendance:', error);
    res.status(500).json({ message: 'An error occurred while recording general meeting attendance' });
  }
};


const getTotalMemberCount = async (req, res) => {
  try {
    // Get counts of each member type
    const assemblyMemberCount = await AssemblyMember.countDocuments();
    const governmentAppointeeCount = await GovernmentAppointee.countDocuments();
    
    // Sum counts for total
    const totalMemberCount = assemblyMemberCount + governmentAppointeeCount;

    // Return response with the total count
    res.status(200).json({ 
      totalMembers: totalMemberCount,
      details: {
        assemblyMembers: assemblyMemberCount,
        governmentAppointees: governmentAppointeeCount
      }
    });
  } catch (error) {
    console.error('Error fetching total member count:', error);
    res.status(500).json({ message: 'An error occurred while fetching the total member count' });
  }
};  


const fetchAllMembers = async (req, res) => {
  try {
    const assemblyMembers = await AssemblyMember.find({});
    const governmentAppointees = await GovernmentAppointee.find({});
    const members = [...assemblyMembers, ...governmentAppointees];
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching all members:', error);
    res.status(500).send({ message: 'An error occurred while fetching members' });
  }
};

const generateAttendanceReport = async (req, res) => {
  try {
    const attendanceRecords = await GeneralMeetingAttendance.find({});

    // Fetch names based on memberId type (AssemblyMember or GovernmentAppointee)
    const populatedRecords = await Promise.all(
      attendanceRecords.map(async (record) => {
        let member = await AssemblyMember.findById(record.memberId);

        if (!member) {
          member = await GovernmentAppointee.findById(record.memberId);
        }

        if (member) {
          return {
            ...record.toObject(),
            name: member.name, // Add the member's name to the response
          };
        }

        return record.toObject(); // Return as is if no member found
      })
    );

    res.status(200).json(populatedRecords);
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).send({ message: 'An error occurred while generating the report' });
  }
};

const deleteAllGeneralMeetingAttendance = async (req, res) => {
  try {
    await GeneralMeetingAttendance.deleteMany({}); // Deletes all records
    res.status(200).json({ message: 'All general meeting attendance records deleted successfully' });
  } catch (error) {
    console.error('Error deleting all attendance records:', error);
    res.status(500).json({ message: 'An error occurred while deleting all attendance records' });
  }
};

const getTotalGeneralAttendance = async (req, res) => {
  try {
    // Count the number of attendance records where 'attended' is true
    const totalAttendanceCount = await GeneralMeetingAttendance.countDocuments({ attended: true });
    
    res.status(200).json({ totalAttendance: totalAttendanceCount });
  } catch (error) {
    console.error('Error fetching total general meeting attendance:', error);
    res.status(500).json({ message: 'An error occurred while fetching total general meeting attendance' });
  }
};

module.exports = {
  getTotalGeneralAttendance,
  getTotalMemberCount,
  deleteAllGeneralMeetingAttendance,
  recordGeneralMeetingAttendance,
  fetchAllMembers,
  generateAttendanceReport,
};

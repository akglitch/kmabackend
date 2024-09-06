const AssemblyMember = require('../models/AssemblyMember');
const GovernmentAppointee = require('../models/GovernmentAppointee');
const Subcommittee = require('../models/Subcommittee');

// Search members by contact
const searchMembers = async (req, res) => {
  const { contact } = req.query;

  try {
    const assemblyMembers = await AssemblyMember.find({ contact: { $regex: contact, $options: 'i' } });
    const governmentAppointees = await GovernmentAppointee.find({ contact: { $regex: contact, $options: 'i' } });

    // Add memberType to each member
    const assemblyMembersWithMemberType = assemblyMembers.map(member => ({
      ...member.toObject(),
      memberType: 'AssemblyMember'
    }));

    const governmentAppointeesWithMemberType = governmentAppointees.map(member => ({
      ...member.toObject(),
      memberType: 'GovernmentAppointee'
    }));

    const members = [...assemblyMembersWithMemberType, ...governmentAppointeesWithMemberType];

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error searching members', error });
  }
};

const deleteMember = async (req, res) => {
  const { memberType, memberId } = req.params;

  try {
    let deletedMember;
    if (memberType === 'AssemblyMember') {
      deletedMember = await AssemblyMember.findByIdAndDelete(memberId);
    } else if (memberType === 'GovernmentAppointee') {
      deletedMember = await GovernmentAppointee.findByIdAndDelete(memberId);
    } else {
      res.status(400).send({ message: 'Invalid member type' });
      return;
    }

    if (!deletedMember) {
      res.status(404).send({ message: 'Member not found' });
      return;
    }

    // Remove the member from all subcommittees
    await Subcommittee.updateMany(
      { 'members.memberId': memberId },
      { $pull: { members: { memberId } } }
    );

    res.status(200).send({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Edit a member by ID
const editMember = async (req, res) => {
  const { id, memberType } = req.params;
  const updateData = req.body;

  try {
    let updatedMember;
    if (memberType === 'AssemblyMember') {
      updatedMember = await AssemblyMember.findByIdAndUpdate(id, updateData, { new: true });
    } else if (memberType === 'GovernmentAppointee') {
      updatedMember = await GovernmentAppointee.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      return res.status(400).json({ message: 'Invalid member type' });
    }

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Error updating member', error });
  }
};

module.exports = {
  searchMembers,
  deleteMember,
  editMember
};

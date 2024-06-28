const groupDB = require("../mongoDB/group");
const userDB = require("../mongoDB/user");
const messageDB = require("../mongoDB/message");
const cloudinary = require('../cloudinary/cloudinary.js')

const createGroup = async (req, res) => {
  const { name, profileImage, members } = req.body;
  if (!name || !profileImage || !members){
    return res.status(400).json({ message: "Group name, profile image and members are required" });
  }
  if (!name)
    return res.status(400).json({ message: "Group name is required" });
  if (!members || members.length < 1)
    return res.status(400).json({ message: "Group members are required" });
  if(!profileImage)
    return res.status(400).json({ message: "Group profile image is required" });

  const userId = req.params.userId;
  const Admin = await userDB.findById(userId);
  const uploadedImage = await cloudinary.uploader.upload(profileImage, {
    upload_preset: "chatapp",
    allowed_formats: ["jpg", "png", "jpeg", "svg", "ico", "jfif", "webp"],
});
  const group = new groupDB({
    name: name,
    profileImage: uploadedImage.url,
    members: [{ _id: Admin._id, name: Admin.name, profileImage: Admin.profileImage}, ...members],
    admin: { _id: Admin._id, name: Admin.name, profileImage: Admin.profileImage},
  });
  try {
    const response = await group.save();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const findUserGroups = async (req, res) => {
  const userId = req.params.userId;
  try {
    const groups = await groupDB.find({
      $or: [{ "members._id": userId }, { "admin._id": userId }],
    }).sort({ updatedAt: -1 })
    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const findGroupMembers = async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const members = await groupDB.findOne({ _id: groupId });
    const group = await groupDB.findById(groupId);
    const adminId = group.admin._id;
    res.status(200).json({ admin: adminId, members: members.members });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const user = req.user;
  try {
    const group = await groupDB.findById(groupId);
    const adminId = group.admin._id;
    if (user._id !== adminId) {
      return res
        .status(400)
        .json({ message: "You are not the admin of the group" });
    }
    if (user._id === adminId) {
      const result = await groupDB.deleteOne({ _id: groupId });
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteallGroupMessages = async (req, res) => {
  const { chatId } = req.params;
  const user = req.user;
  try {
    const group = await groupDB.findById(chatId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const adminId = group.admin._id;
    console.log(user._id, adminId);
    if (user._id !== adminId) {
      return res
        .status(400)
        .json({ message: "You are not the admin of the group" });
    }
    if (user._id === adminId) {
      const messages = await messageDB.deleteMany({ chatId });
      console.log(messages);
      if (messages.deletedCount === 0) {
        return res.status(200).json({ message: "No messages to delete" });
      }
      res.status(200).json(messages);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const createGroupMessage = async (req, res) => {
  const {text, senderName, chatId} = req.body
  const user = req.user
  const members = await groupDB.findOne({ _id: chatId });
  const userdb = await userDB.findById(user._id)
  try{
      if (!members) {
          return res.status(404).json({ error: "Group not found" });
      }
      const memberIds = members.members.map(member => member._id.toString());
      
      if (!memberIds.includes(user._id.toString())) {
          return res.status(400).json({ error: "You are not a member of this group" });
      }
      const message = new messageDB({text, senderId: user._id, senderName, chatId ,profileImage: userdb.profileImage})
      const response = await message.save()
      res.status(200).json(response)
  }catch(error){
      console.log(error)
      res.status(500).json(error)
  }
}
const removeMember = async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const user = req.user;
  
  try {
    const group = await groupDB.findById(groupId);
    const adminId = group.admin._id;
    if (user._id !== adminId) {
      return res
        .status(400)
        .json({ message: "You are not the admin of the group" });
    }

    // Check if the admin is trying to leave
    if (memberId === adminId) {
      // Remove admin from both admin and members
      const updatedGroup = await groupDB.findByIdAndUpdate(
        groupId,
        { $pull: { members: { _id: memberId } }, $unset: { admin: 1 } },
        { new: true }
      );

      // Assign a new admin if there are remaining members
      if (updatedGroup.members.length > 0) {
        const newAdminId = updatedGroup.members[0]._id;
        await groupDB.findByIdAndUpdate(
          groupId,
          { $set: { admin: { _id: newAdminId } } },
          { new: true }
        );
      }

      return res.status(200).json(updatedGroup);
    }

    const response = await groupDB.findByIdAndUpdate(
      groupId,
      { $pull: { members: { _id: memberId } } },
      { new: true }
    );

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const leaveMember = async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const user = req.user;

  try {
    const group = await groupDB.findById(groupId);
    const adminId = group.admin._id;

    if (memberId === adminId) {
      const updatedGroup = await groupDB.findByIdAndUpdate(
        groupId,
        { $pull: { members: { _id: memberId } }, $unset: { admin: 1 } },
        { new: true }
      );

      if (updatedGroup.members.length > 0) {
        const newAdminId = updatedGroup.members[0]._id;
        await groupDB.findByIdAndUpdate(
          groupId,
          { $set: { admin: { _id: newAdminId } } },
          { new: true }
        );
      }

      return res.status(200).json(updatedGroup);
    }

    const response = await groupDB.findByIdAndUpdate(
      groupId,
      { $pull: { members: { _id: memberId } } },
      { new: true }
    );

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addMember = async (req, res) => {
  const { groupId } = req.params;
  const { memberId, name, profileImage } = req.body;
  console.log(req.body);
  try {
    const group = await groupDB.findOne({
      _id: groupId,
      members: { $elemMatch: { _id: memberId } },
    });

    if (group) {
      return res
        .status(400)
        .json({ message: "Member already exists in the group" });
    }
    const response = await groupDB.findByIdAndUpdate(
      groupId,
      { $push: { members: { _id: memberId, name: name, profileImage: profileImage } } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  createGroup,
  findUserGroups,
  findGroupMembers,
  deleteGroup,
  addMember,
  removeMember,
  leaveMember,
  deleteallGroupMessages,
  createGroupMessage,
};

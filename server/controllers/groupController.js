const Group = require("../models/Group");

// @desc    Get all groups for logged in user
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "-password")
      .populate("admins", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "senderId", select: "name profilePic" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res, next) => {
  try {
    const { groupName, members, description, groupImage } = req.body;

    if (!groupName || !members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group name and at least 2 members are required.",
      });
    }

    const allMembers = [...new Set([...members, req.user._id.toString()])];

    const group = await Group.create({
      groupName,
      description: description || "",
      groupImage: groupImage || "",
      members: allMembers,
      admins: [req.user._id],
      createdBy: req.user._id,
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "-password")
      .populate("admins", "-password");

    res.status(201).json({ success: true, group: populatedGroup });
  } catch (error) {
    next(error);
  }
};

// @desc    Update group details
// @route   PUT /api/groups/:id
// @access  Private (admin only)
const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    if (!group.admins.includes(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update group." });
    }

    const { groupName, description, groupImage } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { groupName, description, groupImage },
      { new: true, runValidators: true }
    )
      .populate("members", "-password")
      .populate("admins", "-password");

    res.status(200).json({ success: true, group: updatedGroup });
  } catch (error) {
    next(error);
  }
};

// @desc    Add members to group
// @route   POST /api/groups/:id/members
// @access  Private (admin only)
const addMembers = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    if (!group.admins.includes(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can add members." });
    }

    const { userIds } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: { $each: userIds } } },
      { new: true }
    )
      .populate("members", "-password")
      .populate("admins", "-password");

    res.status(200).json({ success: true, group: updatedGroup });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members
// @access  Private (admin only)
const removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    if (!group.admins.includes(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can remove members." });
    }

    const { userId } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: userId, admins: userId } },
      { new: true }
    )
      .populate("members", "-password")
      .populate("admins", "-password");

    res.status(200).json({ success: true, group: updatedGroup });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave group
// @route   DELETE /api/groups/:id/leave
// @access  Private
const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    await Group.findByIdAndUpdate(req.params.id, {
      $pull: { members: req.user._id, admins: req.user._id },
    });

    res.status(200).json({ success: true, message: "Left the group." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  addMembers,
  removeMember,
  leaveGroup,
};

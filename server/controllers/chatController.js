const Chat = require("../models/Chat");
const User = require("../models/User");

// @desc    Get all chats for logged in user
// @route   GET /api/chats
// @access  Private
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "senderId", select: "name profilePic" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or get 1-to-1 chat
// @route   POST /api/chats
// @access  Private
const createOrGetChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required." });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] },
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    if (chat) {
      return res.status(200).json({ success: true, chat });
    }

    // Create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, userId],
      isGroup: false,
    });

    chat = await Chat.findById(newChat._id).populate("participants", "-password");

    res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chat
// @route   DELETE /api/chats/:id
// @access  Private
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Chat deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getChats, createOrGetChat, deleteChat };

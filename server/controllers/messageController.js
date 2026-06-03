const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Group = require("../models/Group");
const cloudinary = require("../config/cloudinary");

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { type = "Chat", page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({
      chatId,
      chatType: type,
      deleted: false,
    })
      .populate("senderId", "name profilePic")
      .populate({ path: "replyTo", select: "text media senderId", populate: { path: "senderId", select: "name" } })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { chatId, chatType = "Chat", text, media, mediaType, replyTo } = req.body;

    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: "chatId is required." });
    }

    if (!text && !media) {
      return res
        .status(400)
        .json({ success: false, message: "Message text or media is required." });
    }

    let mediaUrl = "";
    // Handle base64 image upload to Cloudinary
    if (media) {
      const uploadResult = await cloudinary.uploader.upload(media, {
        folder: "chatapp/messages",
        resource_type: "auto",
      });
      mediaUrl = uploadResult.secure_url;
    }

    const message = await Message.create({
      chatId,
      chatType,
      senderId: req.user._id,
      text: text || "",
      media: mediaUrl,
      mediaType: mediaType || "",
      replyTo: replyTo || null,
    });

    // Update lastMessage in Chat or Group
    if (chatType === "Chat") {
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });
    } else {
      await Group.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });
    }

    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "name profilePic"
    );

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as seen
// @route   PUT /api/messages/seen/:chatId
// @access  Private
const markAsSeen = async (req, res, next) => {
  try {
    await Message.updateMany(
      {
        chatId: req.params.chatId,
        senderId: { $ne: req.user._id },
        seen: false,
      },
      { $set: { seen: true }, $addToSet: { seenBy: req.user._id } }
    );

    res.status(200).json({ success: true, message: "Messages marked as seen." });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message (soft delete)
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this message." });
    }

    message.deleted = true;
    message.text = "This message was deleted";
    message.media = "";
    await message.save();

    res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    next(error);
  }
};

// @desc    React to a message
// @route   PUT /api/messages/:id/react
// @access  Private
const reactToMessage = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.id;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ success: false, message: "Emoji is required." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReactionIndex > -1) {
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      message.reactions.push({ emoji, userId });
    }

    await message.save();
    
    // Repopulate for client
    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "name profilePic"
    );

    res.status(200).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage, markAsSeen, deleteMessage, reactToMessage };

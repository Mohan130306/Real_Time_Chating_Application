const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Can ref Chat or Group
    },
    chatType: {
      type: String,
      enum: ["Chat", "Group"],
      default: "Chat",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    media: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["image", "pdf", "audio", "video", ""],
      default: "",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [
      {
        emoji: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    seen: {
      type: Boolean,
      default: false,
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

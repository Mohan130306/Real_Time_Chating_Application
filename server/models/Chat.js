const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure unique 1-to-1 chats
chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Map of userId -> socketId for online tracking
const activeUsers = new Map();

const socketHandler = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🟢 User connected: ${socket.user.name} (${socket.id})`);

    // Register user as online
    activeUsers.set(userId, socket.id);

    // Update DB status
    await User.findByIdAndUpdate(userId, { status: "online" });

    // Broadcast updated online users list
    io.emit("onlineUsers", Array.from(activeUsers.keys()));

    // ─── Join Rooms ──────────────────────────────────────────────────────────
    socket.on("joinRoom", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("joinGroupRoom", ({ groupId }) => {
      socket.join(groupId);
    });

    // ─── Messaging ────────────────────────────────────────────────────────────
    socket.on("sendMessage", (message) => {
      // Emit to room (chatId or groupId)
      socket.to(message.chatId).emit("receiveMessage", message);
    });

    socket.on("messageReaction", ({ chatId, message }) => {
      socket.to(chatId).emit("messageReaction", { chatId, message });
    });

    socket.on("messageDeleted", ({ chatId, messageId }) => {
      socket.to(chatId).emit("messageDeleted", { chatId, messageId });
    });

    // ─── Typing Indicators ────────────────────────────────────────────────────
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { chatId, userId });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", { chatId });
    });

    // ─── Seen Status ──────────────────────────────────────────────────────────
    socket.on("markSeen", ({ chatId }) => {
      socket.to(chatId).emit("messageSeen", { chatId });
    });

    // ─── Notifications ────────────────────────────────────────────────────────
    socket.on("sendNotification", ({ receiverId, notification }) => {
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification);
      }
    });

    // ─── Disconnect ───────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`🔴 User disconnected: ${socket.user.name}`);
      activeUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        status: "offline",
        lastSeen: new Date(),
      });

      io.emit("onlineUsers", Array.from(activeUsers.keys()));
    });
  });
};

module.exports = socketHandler;

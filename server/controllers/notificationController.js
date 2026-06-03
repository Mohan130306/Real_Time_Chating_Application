const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name profilePic")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

const clearNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.status(200).json({ success: true, message: "Notifications cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, clearNotifications };

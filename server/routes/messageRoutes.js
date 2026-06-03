const express = require("express");
const router = express.Router();
const {
  getMessages,
  sendMessage,
  markAsSeen,
  deleteMessage,
  reactToMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:chatId", protect, getMessages);
router.post("/", protect, sendMessage);
router.put("/seen/:chatId", protect, markAsSeen);
router.delete("/:id", protect, deleteMessage);
router.put("/:id/react", protect, reactToMessage);

module.exports = router;

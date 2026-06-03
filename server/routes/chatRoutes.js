const express = require("express");
const router = express.Router();
const {
  getChats,
  createOrGetChat,
  deleteChat,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getChats);
router.post("/", protect, createOrGetChat);
router.delete("/:id", protect, deleteChat);

module.exports = router;

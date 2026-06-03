const express = require("express");
const router = express.Router();
const {
  getGroups,
  createGroup,
  updateGroup,
  addMembers,
  removeMember,
  leaveGroup,
} = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getGroups);
router.post("/", protect, createGroup);
router.put("/:id", protect, updateGroup);
router.post("/:id/members", protect, addMembers);
router.delete("/:id/members", protect, removeMember);
router.delete("/:id/leave", protect, leaveGroup);

module.exports = router;

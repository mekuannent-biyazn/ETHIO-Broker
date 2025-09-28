const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserRole,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMIddleware");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin only
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUserById);
router.delete("/:id", protect, admin, deleteUserById);

router.patch("/:id/role", protect, admin, updateUserRole);

module.exports = router;

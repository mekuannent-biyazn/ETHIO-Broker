const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserRole,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail); // To resend verification email

// Admin only
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUserById);
router.delete("/:id", protect, admin, deleteUserById);

router.patch("/:id/role", protect, admin, updateUserRole);

module.exports = router;

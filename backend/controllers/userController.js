const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// For OTP send
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "mekuannentbiyazn@gmail.com",
    pass: process.env.EMAIL_PASS || "oieceoiynxdocycx",
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// @desc Register user
// @route POST /api/users/register
// @access Public
exports.registerUser = async (req, res, next) => {
  try {
    const { fname, lname, email, password, confirmPassword, phone, city, role } = req.body;

    if (!fname || !lname || !email || !password || !confirmPassword || !phone || !city) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and Confirm Password do not match" });
    }

    const count = await User.countDocuments();
    let assignRole = role || "user";

    // First registered user is admin
    if (count === 0) {
      assignRole = "admin";
    }
    // Second registered user is broker (as per your original logic)
    else if (count === 1) {
      assignRole = "broker";
    }

    const hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = await User.create({
      fname,
      lname,
      email,
      password: hash,
      phone,
      city,
      role: assignRole,
      role: asignrole,
      otp,
      otpExpiry,
    });

    // Generate a random verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    // Create frontend link for verification
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: "mekuannentbiyazn@gmail.com",
      to: user.email,
      subject: "Account Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${user.fname},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.status(201).json({
      message:
        "user created successfully, please verify OTP send to your email",
      _id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// users verify OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    if (user.isVerified)
      return res.status(400).json({ message: "user is already verified" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email Verified successfully, you can now log in!" });
  } catch (error) {
    res.status(500).json({ message: "Error Verifing OTP", error });
  }
};

// resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    // Generate a new verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Create frontend link
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // use environment variable
      to: user.email,
      subject: "Resend Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${user.fname},</p>
        <p>You requested a new verification link. Click below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Verification email resent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    return res.status(500).json({
      success: false,
      message: "Error resending verification email",
      error,
    });
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Enter Email and Password!" });

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
    if (!user)
      return res.status(400).json({ message: "This Email is not registered!" });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Email not verified. Please verify your email before logging in.",
      });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid Password!" });

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user info and token
    return res.json({
      message: "Logged in successfully",
      user: { id: user._id, name: user.fname, email: user.email },
      token,
    });
  } 
};

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc Get user by ID (Admin only)
// @route GET /api/users/:id
// @access Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc Update user (Admin only)
// @route PUT /api/users/:id
// @access Private/Admin
exports.updateUserById = async (req, res, next) => {
  try {
    const { password, confirmPassword, ...otherFields } = req.body; // Exclude password fields if not meant for direct update here
    let updateData = { ...otherFields };

    // You might want to handle password updates in a separate route for security
    // For now, if password is sent, it's hashed
    if (password && password !== '') {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password and Confirm Password do not match" });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true, // Ensures schema validators run on update
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user (Admin only)
// @route DELETE /api/users/:id
// @access Private/Admin
exports.deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc Update user role (Admin only)
// @route PATCH /api/users/:id/role
// @access Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    // Allow 'user', 'admin', 'broker' roles
    if (!["user", "admin", "broker"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
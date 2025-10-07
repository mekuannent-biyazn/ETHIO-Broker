const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lname: {
      type: String,
      required: [true, "Please add a last name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "broker"], // Added 'broker'
      default: "user",
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    city: { type: String },
    // OTP fields
    otp: { type: String },
    otpExpiry: { type: Date },
    // email verification fields
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

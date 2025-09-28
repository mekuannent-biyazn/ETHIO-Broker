const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(?:\+251|0)\d{9}$/,
        "Please enter a valid Ethiopian phone number",
      ],
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    city: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

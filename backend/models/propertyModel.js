const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (property owner)
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    propertyTypes: {
      type: [String], // Array of property types
      required: true,
      enum: ["House", "Car", "Electronics"], // you can add more
    },

    price: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String, // e.g. "Bole, Addis Ababa"
      required: true,
      trim: true,
    },

    images: {
      type: [String], // Array of image URLs or file paths
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Rented"],
      // default: "Available",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;

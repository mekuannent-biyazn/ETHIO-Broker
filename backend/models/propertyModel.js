const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    pname: {
      type: String,
      required: [true, "Please add a property name"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    picture: {
      type: String, // Storing URL to the picture
      default: "no-photo.jpg",
    },
    // You might want to link properties to users (brokers/admins)
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);
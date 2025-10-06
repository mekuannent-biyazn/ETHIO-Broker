const Property = require("../models/propertyModel");

// Get all approved properties (for public users/buyers)
exports.getAllApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "Available" });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create property (owner)
exports.createProperty = async (req, res) => {
  try {
    const { title, description, propertyTypes, price, city, location, images } =
      req.body;

    if (!title || !price || !propertyTypes || !city || !location || !images) {
      return res
        .status(400)
        .json({ message: "Please fill out all required fields" });
    }

    const newProperty = new Property({
      title,
      description,
      propertyTypes,
      price,
      city,
      location,
      images,
      owner: req.user._id,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update property (only owner)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({ message: "Property not found" });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    Object.assign(property, req.body);
    property.status = "pending"; // re-approval needed after edits
    await property.save();

    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all properties (admin only)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "fname email");
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete property (owner or admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin approves/rejects property
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    property.status = req.body.status; // "approved" or "rejected"
    await property.save();

    res.status(200).json({ message: `Property ${property.status}`, property });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

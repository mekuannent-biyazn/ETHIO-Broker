const Property = require("../models/propertyModel"); // Import the Mongoose Property model

// @desc Get all properties
// @route GET /api/property
// @access Public (or Private if you want)
exports.getAllProperty = async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new property
// @route POST /api/property
// @access Private/Admin or Private/Broker
exports.createProperty = async (req, res, next) => {
  try {
    const { pname, price, picture, description } = req.body;

    if (!pname || !price || !description) {
      return res
        .status(400)
        .json({
          message: "Property name, price, and description are required.",
        });
    }

    const newProperty = await Property.create({
      pname,
      price,
      picture,
      description,
      // If you add a 'user' field to the property model to link to a broker/admin
      // user: req.user.id,
    });

    return res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
};

// @desc Get property by ID
// @route GET /api/property/:id
// @access Public (or Private if you want)
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
    return res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// @desc Update property by ID
// @route PUT /api/property/:id
// @access Private/Admin or Private/Broker
exports.updateProperty = async (req, res, next) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.status(200).json({
      message: "Property updated successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete property by ID
// @route DELETE /api/property/:id
// @access Private/Admin or Private/Broker
exports.deletePropertyById = async (req, res, next) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found." });
    }
    return res.status(200).json({
      message: "Property deleted successfully.",
      deletedData: deletedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// const Property = require("../models/propertyModel");

// // Get all approved properties (for public users/buyers)
// exports.getAllApprovedProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({ status: "Available" });
//     res.status(200).json(properties);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Create property (owner)
// exports.createProperty = async (req, res) => {
//   try {
//     const { title, description, propertyTypes, price, city, location, images } =
//       req.body;

//     if (!title || !price || !propertyTypes || !city || !location || !images) {
//       return res
//         .status(400)
//         .json({ message: "Please fill out all required fields" });
//     }

//     const newProperty = new Property({
//       title,
//       description,
//       propertyTypes,
//       price,
//       city,
//       location,
//       images,
//       owner: req.user._id,
//     });

//     await newProperty.save();
//     res.status(201).json(newProperty);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Update property (only owner)
// exports.updateProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);

//     if (!property)
//       return res.status(404).json({ message: "Property not found" });
//     if (property.owner.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to update this property" });
//     }

//     Object.assign(property, req.body);
//     property.status = "pending"; // re-approval needed after edits
//     await property.save();

//     res.status(200).json(property);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get all properties (admin only)
// exports.getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().populate("owner", "fname email");
//     res.status(200).json(properties);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Delete property (owner or admin)
// exports.deleteProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property)
//       return res.status(404).json({ message: "Property not found" });

//     if (
//       property.owner.toString() !== req.user._id.toString() &&
//       req.user.role !== "admin"
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to delete this property" });
//     }

//     await property.deleteOne();
//     res.status(200).json({ message: "Property deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Admin approves/rejects property
// exports.approveProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property)
//       return res.status(404).json({ message: "Property not found" });

//     property.status = req.body.status; // "approved" or "rejected"
//     await property.save();

//     res.status(200).json({ message: `Property ${property.status}`, property });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

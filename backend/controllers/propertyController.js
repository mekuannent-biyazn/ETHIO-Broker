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
        .json({ message: "Property name, price, and description are required." });
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
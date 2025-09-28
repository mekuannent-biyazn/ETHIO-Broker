const express = require("express");
const {
  getAllProperty,
  createProperty,
  getAllPropertyById,
  updateProperty,
  deletePropertyById,
} = require("../controllers/propertyControler");
const router = express.Router();

// get properties
router.get("/property", getAllProperty);

// create property
router.post("/property", createProperty);

// get property by id
router.get("/property/:id", getAllPropertyById);

// update property by id
router.put("/property/:id", updateProperty);

// delete property by id
router.delete("/property/:id", deletePropertyById);

module.exports = router;

const express = require("express");
const {
  getAllApprovedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  getAllProperties,
} = require("../controllers/propertyController");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

// public route to get all approved properties
router.get("/approved", getAllApprovedProperties);

//protect
router.use(protect);

// protected route to create a property (only for authenticated users)
router.post("/", createProperty);
// router.get("/:id", getAllPropertyById);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

// admin actions
router.get("/", admin, getAllProperties);
router.put("/:id/approve", admin, approveProperty);

module.exports = router;

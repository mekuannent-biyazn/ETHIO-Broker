const express = require("express");
const {
  getAllProperty,
  createProperty,
  getPropertyById, // Renamed from getAllPropertyById for clarity
  updateProperty,
  deletePropertyById,
} = require("../controllers/propertyController"); // <<<--- THIS LINE must be correct
const { protect, adminOrBroker } = require("../middleware/authMiddleware"); // Import auth middleware
const router = express.Router();

// Publicly accessible routes (or you can add protect middleware if needed)
router.get("/", getAllProperty); // Changed path to '/' to be consistent with /api
router.get("/:id", getPropertyById); // Changed path to '/:id'

// Routes protected for Admin or Broker
router.post("/", protect, adminOrBroker, createProperty);
router.put("/:id", protect, adminOrBroker, updateProperty);
router.delete("/:id", protect, adminOrBroker, deletePropertyById);

module.exports = router;
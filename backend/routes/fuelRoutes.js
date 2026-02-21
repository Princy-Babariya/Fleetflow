const express = require("express");
const router = express.Router();
const { createFuelRecord, getFuelRecords, getFuelRecordById, updateFuelRecord, deleteFuelRecord } = require("../controllers/fuelController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// Create a new fuel record (admin or dispatcher)
router.post("/", auth, allow("admin", "dispatcher"), createFuelRecord);

// Get all fuel records (authenticated users)
router.get("/", auth, getFuelRecords);

// Get a fuel record by ID (authenticated users)
router.get("/:id", auth, getFuelRecordById);

// Update a fuel record (admin or dispatcher)
router.put("/:id", auth, allow("admin", "dispatcher"), updateFuelRecord);

// Delete a fuel record (admin)
router.delete("/:id", auth, allow("admin"), deleteFuelRecord);

module.exports = router;
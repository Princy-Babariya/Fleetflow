const express = require("express");
const router = express.Router();
const { createFuelRecord, getFuelRecords, getFuelRecordById, updateFuelRecord, deleteFuelRecord } = require("../controllers/fuelController");

// Create a new fuel record
router.post("/", createFuelRecord);

// Get all fuel records
router.get("/", getFuelRecords);

// Get a fuel record by ID
router.get("/:id", getFuelRecordById);

// Update a fuel record
router.put("/:id", updateFuelRecord);

// Delete a fuel record
router.delete("/:id", deleteFuelRecord);

module.exports = router;
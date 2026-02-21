const express = require("express");
const router = express.Router();
const { createMaintenanceRecord, getMaintenanceRecords, getMaintenanceRecordById, updateMaintenanceRecord, deleteMaintenanceRecord } = require("../controllers/maintenanceController");

// Create a new maintenance record
router.post("/", createMaintenanceRecord);

// Get all maintenance records
router.get("/", getMaintenanceRecords);

// Get a maintenance record by ID
router.get("/:id", getMaintenanceRecordById);

// Update a maintenance record
router.put("/:id", updateMaintenanceRecord);

// Delete a maintenance record
router.delete("/:id", deleteMaintenanceRecord);

module.exports = router;
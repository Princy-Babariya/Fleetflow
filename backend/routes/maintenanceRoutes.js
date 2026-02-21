const express = require("express");
const router = express.Router();
const { createMaintenanceRecord, getMaintenanceRecords, getMaintenanceRecordById, updateMaintenanceRecord, deleteMaintenanceRecord } = require("../controllers/maintenanceController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// Create a new maintenance record (admin or dispatcher)
router.post("/", auth, allow("admin", "dispatcher"), createMaintenanceRecord);

// Get all maintenance records (authenticated users)
router.get("/", auth, getMaintenanceRecords);

// Get a maintenance record by ID (authenticated users)
router.get("/:id", auth, getMaintenanceRecordById);

// Update a maintenance record (admin or dispatcher)
router.put("/:id", auth, allow("admin", "dispatcher"), updateMaintenanceRecord);

// Delete a maintenance record (admin)
router.delete("/:id", auth, allow("admin"), deleteMaintenanceRecord);

module.exports = router;
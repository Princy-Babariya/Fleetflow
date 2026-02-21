const express = require("express");
const router = express.Router();
const { createDriver, getDrivers, getDriverById, updateDriver, deleteDriver } = require("../controllers/driverController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// Protected routes: require auth for all driver endpoints
// Create a new driver (admin or dispatcher)
router.post("/", auth, allow("admin", "dispatcher"), createDriver);

// Get all drivers (authenticated users)
router.get("/", auth, getDrivers);

// Get a driver by ID (authenticated users)
router.get("/:id", auth, getDriverById);

// Update a driver (admin or dispatcher)
router.put("/:id", auth, allow("admin", "dispatcher"), updateDriver);

// Delete a driver (admin only)
router.delete("/:id", auth, allow("admin"), deleteDriver);

module.exports = router;
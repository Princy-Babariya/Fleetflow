const express = require("express");
const router = express.Router();

const { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle } = require("../controllers/vehicleController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// List vehicles (authenticated)
router.get("/", auth, listVehicles);

// Create vehicle (admin or dispatcher)
router.post("/", auth, allow("admin", "dispatcher"), createVehicle);

// Get single vehicle
router.get("/:id", auth, getVehicle);

// Update vehicle (admin or dispatcher)
router.put("/:id", auth, allow("admin", "dispatcher"), updateVehicle);

// Delete vehicle (admin)
router.delete("/:id", auth, allow("admin"), deleteVehicle);

module.exports = router;
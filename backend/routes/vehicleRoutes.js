const express = require("express");
const router = express.Router();

const { createVehicle } = require("../controllers/vehicleController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// Protected: only admin or dispatcher can create vehicles
router.post("/", auth, allow("admin", "dispatcher"), createVehicle);

module.exports = router;
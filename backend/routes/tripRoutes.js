const express = require("express");
const router = express.Router();

const { createTrip, completeTrip, listTrips, getTripById, updateTrip, deleteTrip } = require("../controllers/tripController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// List all trips (authenticated users)
router.get("/", auth, listTrips);

// Create trip (dispatcher or admin)
router.post("/", auth, allow("dispatcher", "admin"), createTrip);

// Get single trip by ID (authenticated users)
router.get("/:tripId", auth, getTripById);

// Update trip (dispatcher or driver)
router.put("/:tripId", auth, allow("driver", "dispatcher", "admin"), updateTrip);

// Complete trip (driver or dispatcher)
router.put("/:tripId/complete", auth, allow("driver", "dispatcher"), completeTrip);

// Delete trip (admin only)
router.delete("/:tripId", auth, allow("admin"), deleteTrip);

module.exports = router;
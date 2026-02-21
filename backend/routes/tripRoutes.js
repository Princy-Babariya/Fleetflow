const express = require("express");
const router = express.Router();

const { createTrip, completeTrip } = require("../controllers/tripController");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

// Create trip (dispatcher only)
router.post("/", auth, allow("dispatcher"), createTrip);

// Complete trip (driver or dispatcher)
router.put("/:tripId/complete", auth, allow("driver", "dispatcher"), completeTrip);

module.exports = router;
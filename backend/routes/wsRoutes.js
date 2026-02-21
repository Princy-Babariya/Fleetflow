const express = require("express");
const router = express.Router();

// Accept POST location updates and broadcast over Socket.IO
router.post("/update", (req, res) => {
  const io = req.app.get("io");
  const { vehicleId, lat, lng, timestamp } = req.body;
  if (!vehicleId || !lat || !lng) return res.status(400).json({ message: "vehicleId, lat and lng required" });

  const payload = { vehicleId, lat, lng, timestamp: timestamp || Date.now() };
  if (io) io.emit("vehicleLocationUpdate", payload);

  res.json({ message: "Location broadcasted", payload });
});

module.exports = router;

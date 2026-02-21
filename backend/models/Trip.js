const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  cargoWeight: Number,
  revenue: Number,
  startOdometer: Number,
  endOdometer: Number,
  status: { type: String, default: "Draft" }
});

module.exports = mongoose.model("Trip", tripSchema);
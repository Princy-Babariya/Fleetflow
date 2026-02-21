const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  licensePlate: { type: String, unique: true },
  maxCapacity: Number,
  odometer: Number,
  acquisitionCost: Number,
  status: { type: String, default: "Available" }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
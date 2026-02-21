const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  liters: Number,
  cost: Number,
  date: Date
});

module.exports = mongoose.model("Fuel", fuelSchema);
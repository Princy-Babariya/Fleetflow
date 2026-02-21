const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  cost: Number,
  description: String,
  date: Date
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
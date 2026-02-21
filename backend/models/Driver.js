const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  licenseType: String,
  licenseExpiry: Date,
  safetyScore: Number,
  status: { type: String, default: "OnDuty" }
});

module.exports = mongoose.model("Driver", driverSchema);
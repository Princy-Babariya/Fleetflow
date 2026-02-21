const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");

exports.getDashboard = async (req, res) => {
  const totalVehicles = await Vehicle.countDocuments();
  const activeFleet = await Vehicle.countDocuments({ status: "OnTrip" });
  const maintenanceAlerts = await Vehicle.countDocuments({ status: "InShop" });
  const pendingCargo = await Trip.countDocuments({ status: "Draft" });

  const utilization = totalVehicles > 0
    ? (activeFleet / totalVehicles) * 100
    : 0;

  res.json({
    totalVehicles,
    activeFleet,
    maintenanceAlerts,
    pendingCargo,
    utilization
  });
};
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Fuel = require('../models/Fuel');
const Maintenance = require('../models/Maintainance');

// GET /api/analytics/overview
exports.overview = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeFleet = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const maintenanceAlerts = await Maintenance.countDocuments({ date: { $gte: thirtyDaysAgo } });

    const completedTrips = await Trip.countDocuments({ status: 'Completed' });
    const totalTrips = await Trip.countDocuments();
    const utilizationRate = totalTrips === 0 ? 0 : Math.round((completedTrips / totalTrips) * 100);

    const pendingCargo = await Trip.countDocuments({ status: { $in: ['Draft', 'Dispatched'] } });

    // Fuel trend (last 6 months) - sum liters per month
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const fuelTrendAgg = await Fuel.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, liters: { $sum: '$liters' }, cost: { $sum: '$cost' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Trips overview last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const tripsOverview = await Trip.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1, '_id.day': 1 } }
    ]);

    // Financials
    const totalRevenueAgg = await Trip.aggregate([{ $group: { _id: null, revenue: { $sum: { $ifNull: ['$revenue', 0] } } } }]);
    const totalRevenue = totalRevenueAgg[0] ? totalRevenueAgg[0].revenue : 0;
    const vehicleCostsAgg = await Vehicle.aggregate([{ $group: { _id: null, cost: { $sum: { $ifNull: ['$acquisitionCost', 0] } } } }]);
    const totalVehicleCost = vehicleCostsAgg[0] ? vehicleCostsAgg[0].cost : 0;
    const vehicleROI = totalVehicleCost === 0 ? 0 : Math.round((totalRevenue / totalVehicleCost) * 100);

    const maintenanceAgg = await Maintenance.aggregate([{ $group: { _id: null, cost: { $sum: { $ifNull: ['$cost', 0] } } } }]);
    const totalMaintenance = maintenanceAgg[0] ? maintenanceAgg[0].cost : 0;
    const fuelAgg = await Fuel.aggregate([{ $group: { _id: null, cost: { $sum: { $ifNull: ['$cost', 0] } } } }]);
    const totalFuelCost = fuelAgg[0] ? fuelAgg[0].cost : 0;
    const totalOperationalCost = totalMaintenance + totalFuelCost;

    res.json({
      totalVehicles,
      activeFleet,
      maintenanceAlerts,
      utilizationRate,
      pendingCargo,
      fuelTrend: fuelTrendAgg,
      tripsOverview,
      totalRevenue,
      vehicleROI,
      totalOperationalCost
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

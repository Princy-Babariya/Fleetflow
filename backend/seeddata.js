// Seed realistic data for Trips, Maintenance, and Fuel
const mongoose = require('mongoose');
require('dotenv').config();
const Trip = require('./models/Trip');
const Maintenance = require('./models/Maintainance');
const Fuel = require('./models/Fuel');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Get existing vehicles and drivers
    const vehicles = await Vehicle.find();
    const drivers = await Driver.find();

    if (vehicles.length === 0 || drivers.length === 0) {
      console.log('Please run seed users, drivers, and vehicles first!');
      process.exit(1);
    }

    console.log(`Found ${vehicles.length} vehicles and ${drivers.length} drivers`);

    // Check existing counts
    const tripCount = await Trip.countDocuments();
    const mainCount = await Maintenance.countDocuments();
    const fuelCount = await Fuel.countDocuments();

    if (tripCount === 0) {
      console.log('Creating realistic trips...');
      const trips = [];

      for (let i = 0; i < 15; i++) {
        const originIdx = Math.floor(Math.random() * tripOrigins.length);
        const destIdx = Math.floor(Math.random() * tripDestinations.length);
        const vehicleIdx = Math.floor(Math.random() * vehicles.length);
        const driverIdx = Math.floor(Math.random() * drivers.length);
        const daysAgo = Math.floor(Math.random() * 30);
        const status = daysAgo > 7 ? 'Completed' : daysAgo > 2 ? 'Dispatched' : 'Pending';

        trips.push({
          vehicleId: vehicles[vehicleIdx]._id,
          driverId: drivers[driverIdx]._id,
          cargoWeight: Math.floor(Math.random() * 3000) + 500,
          revenue: Math.floor(Math.random() * 2000) + 500,
          startOdometer: Math.floor(Math.random() * 200000) + 10000,
          endOdometer: Math.floor(Math.random() * 200000) + 10500,
          status: status
        });
      }

      const createdTrips = await Trip.insertMany(trips);
      console.log(`✓ Created ${createdTrips.length} trips`);
    } else {
      console.log(`Trips already exist (${tripCount}). Skipping...`);
    }

    if (mainCount === 0) {
      console.log('Creating realistic maintenance records...');
      const serviceTypes = [
        'Oil Change',
        'Tire Rotation',
        'Brake Inspection',
        'Engine Check-up',
        'Transmission Service',
        'Battery Replacement',
        'Air Filter Change',
        'Coolant Flush',
        'Suspension Check',
        'Headlight Replacement',
        'Windshield Wiper Replacement',
        'Spark Plugs Change'
      ];

      const vendors = [
        'AutoCare Service Center',
        'Express Maintenance Pro',
        'Fleet Maintenance Hub',
        'TruckStop Service Station',
        'Complete Auto Service',
        'Premium Fleet Services',
        'Quick Fix Garage',
        'Professional Auto Clinic'
      ];

      const maintenance = [];
      for (let i = 0; i < 20; i++) {
        const vehicleIdx = Math.floor(Math.random() * vehicles.length);
        const daysAgo = Math.floor(Math.random() * 60);

        maintenance.push({
          vehicleId: vehicles[vehicleIdx]._id,
          description: serviceTypes[Math.floor(Math.random() * serviceTypes.length)] + ' - ' + vendors[Math.floor(Math.random() * vendors.length)],
          cost: Math.floor(Math.random() * 800) + 150,
          date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }

      const createdMaintenance = await Maintenance.insertMany(maintenance);
      console.log(`✓ Created ${createdMaintenance.length} maintenance records`);
    } else {
      console.log(`Maintenance records already exist (${mainCount}). Skipping...`);
    }

    if (fuelCount === 0) {
      console.log('Creating realistic fuel records...');
      const suppliers = [
        'Shell',
        'Exxon Mobil',
        'Chevron',
        'BP',
        'Speedway',
        'Pilot Flying J',
        'Love\'s Travel Stops',
        'TravelCenters of America',
        'Circle K',
        'Casey\'s General Stores'
      ];

      const fuel = [];
      for (let i = 0; i < 30; i++) {
        const vehicleIdx = Math.floor(Math.random() * vehicles.length);
        const daysAgo = Math.floor(Math.random() * 45);
        const liters = Math.floor(Math.random() * 150) + 50;
        const costPerLiter = (Math.random() * 0.5) + 3.2; // $3.20 - $3.70 per liter

        fuel.push({
          vehicleId: vehicles[vehicleIdx]._id,
          liters: liters,
          cost: parseFloat((liters * costPerLiter).toFixed(2)),
          date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }

      const createdFuel = await Fuel.insertMany(fuel);
      console.log(`✓ Created ${createdFuel.length} fuel records`);
    } else {
      console.log(`Fuel records already exist (${fuelCount}). Skipping...`);
    }

    console.log('\n✓ Data seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedData();

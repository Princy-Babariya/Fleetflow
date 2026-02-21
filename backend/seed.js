const mongoose = require('mongoose');
require('dotenv').config();
const Driver = require('./models/Driver');
const Vehicle = require('./models/Vehicle');
const Trip = require('./models/Trip');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleet_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Driver.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('Cleared existing data');

    // Seed Drivers
    const drivers = await Driver.insertMany([
      { name: 'John Smith', licenseType: 'Class B', licenseExpiry: new Date('2026-12-31'), safetyScore: 95, status: 'OnDuty' },
      { name: 'Alice Johnson', licenseType: 'Class B', licenseExpiry: new Date('2027-06-30'), safetyScore: 88, status: 'OnDuty' },
      { name: 'Mike Davis', licenseType: 'Class A', licenseExpiry: new Date('2025-12-31'), safetyScore: 92, status: 'OffDuty' },
      { name: 'Sarah Wilson', licenseType: 'Class B', licenseExpiry: new Date('2026-03-15'), safetyScore: 91, status: 'OnDuty' },
      { name: 'Robert Brown', licenseType: 'Class A', licenseExpiry: new Date('2027-09-20'), safetyScore: 87, status: 'OnDuty' },
    ]);
    console.log('Seeded drivers:', drivers.length);

    // Seed Vehicles
    const vehicles = await Vehicle.insertMany([
      { licensePlate: 'ABC-001', make: 'Toyota', model: 'Hiace', year: 2022, capacity: 2500, currentOdometer: 45000, status: 'Active', assignedDriver: drivers[0]._id },
      { licensePlate: 'ABC-002', make: 'Ford', model: 'Transit', year: 2021, capacity: 3000, currentOdometer: 62000, status: 'Active', assignedDriver: drivers[1]._id },
      { licensePlate: 'ABC-003', make: 'Mercedes', model: 'Sprinter', year: 2023, capacity: 3500, currentOdometer: 28000, status: 'Active', assignedDriver: drivers[3]._id },
      { licensePlate: 'ABC-004', make: 'Volvo', model: 'FL', year: 2020, capacity: 5000, currentOdometer: 120000, status: 'Maintenance', assignedDriver: drivers[2]._id },
      { licensePlate: 'ABC-005', make: 'MAN', model: 'TGX', year: 2022, capacity: 6000, currentOdometer: 89000, status: 'Active', assignedDriver: drivers[4]._id },
    ]);
    console.log('Seeded vehicles:', vehicles.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

// Quick seed script - creates drivers and vehicles directly
const mongoose = require('mongoose');
require('dotenv').config();

async function seed() {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGO_URI ? 'Using MONGO_URI from env' : 'Using default');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    const Driver = require('./models/Driver');
    const Vehicle = require('./models/Vehicle');

    // Check if drivers already exist
    const existingDrivers = await Driver.countDocuments();
    console.log('Existing drivers:', existingDrivers);

    if (existingDrivers === 0) {
      console.log('Creating drivers...');
      const drivers = [
        { name: 'John Smith', licenseType: 'Class B', licenseExpiry: new Date('2026-12-31'), safetyScore: 95, status: 'OnDuty' },
        { name: 'Alice Johnson', licenseType: 'Class B', licenseExpiry: new Date('2027-06-30'), safetyScore: 88, status: 'OnDuty' },
        { name: 'Mike Davis', licenseType: 'Class A', licenseExpiry: new Date('2025-12-31'), safetyScore: 92, status: 'OffDuty' },
        { name: 'Sarah Wilson', licenseType: 'Class B', licenseExpiry: new Date('2026-03-15'), safetyScore: 91, status: 'OnDuty' },
        { name: 'Robert Brown', licenseType: 'Class A', licenseExpiry: new Date('2027-09-20'), safetyScore: 87, status: 'OnDuty' },
      ];
      
      const created = await Driver.insertMany(drivers);
      console.log('✓ Created drivers:', created.length);

      // Now create vehicles
      console.log('Creating vehicles...');
      const vehicles = [
        { name: 'Truck Alpha', licensePlate: 'ABC-001', maxCapacity: 2500, odometer: 45000, acquisitionCost: 250000, status: 'Active' },
        { name: 'Van Beta', licensePlate: 'ABC-002', maxCapacity: 3000, odometer: 62000, acquisitionCost: 300000, status: 'Active' },
        { name: 'Truck Gamma', licensePlate: 'ABC-003', maxCapacity: 3500, odometer: 28000, acquisitionCost: 350000, status: 'Active' },
        { name: 'Truck Delta', licensePlate: 'ABC-004', maxCapacity: 5000, odometer: 120000, acquisitionCost: 450000, status: 'Maintenance' },
        { name: 'Truck Epsilon', licensePlate: 'ABC-005', maxCapacity: 6000, odometer: 89000, acquisitionCost: 500000, status: 'Active' },
      ];

      const vehiclesCreated = await Vehicle.insertMany(vehicles);
      console.log('✓ Created vehicles:', vehiclesCreated.length);
    } else {
      console.log('Drivers already exist. Skipping seed.');
    }

    console.log('\n✓ Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();

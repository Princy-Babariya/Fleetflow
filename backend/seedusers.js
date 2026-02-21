// Seed a test user for quick testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const User = require('./models/User');

    // Check if admin user exists
    const existingUser = await User.findOne({ email: 'admin@fleet.local' });
    
    if (!existingUser) {
      console.log('Creating test users...');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const users = [
        { name: 'Admin User', email: 'admin@fleet.local', password: hashedPassword, role: 'admin' },
        { name: 'Dispatcher', email: 'dispatcher@fleet.local', password: hashedPassword, role: 'dispatcher' },
        { name: 'Driver One', email: 'driver1@fleet.local', password: hashedPassword, role: 'driver' },
        { name: 'Driver Two', email: 'driver2@fleet.local', password: hashedPassword, role: 'driver' },
      ];

      const created = await User.insertMany(users);
      console.log('✓ Created test users:', created.length);
      console.log('\nTest Accounts:');
      users.forEach(u => {
        console.log(`  ${u.role.toUpperCase()}: ${u.email} / ${password}`);
      });
    } else {
      console.log('Users already exist.');
    }

    await mongoose.disconnect();
    console.log('\n✓ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedUser();

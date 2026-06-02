import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@xebia.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@xebia.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@xebia.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();

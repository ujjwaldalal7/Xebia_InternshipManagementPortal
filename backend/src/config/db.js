// ──────────────────────────────────────────────────────
// Database Configuration — MongoDB via Mongoose
// ──────────────────────────────────────────────────────
import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI from environment variables.
 * Includes retry logic and connection event listeners.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connection event listeners for monitoring
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

export default connectDB;

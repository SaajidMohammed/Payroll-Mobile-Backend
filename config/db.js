const mongoose = require('mongoose');

/**
 * Establishing connection to MongoDB
 * Updated to support Mongoose 6/7+ by removing deprecated options.
 */
const connectDB = async () => {
  try {
    // Newer versions of Mongoose do not require these options [cite: 11]
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Exit process with failure if the database is not accessible
    process.exit(1);
  }
};

module.exports = connectDB;
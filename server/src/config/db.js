const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // On Vercel serverless, skip connecting to localhost MongoDB if MONGODB_URI is not configured
  const uri = process.env.MONGODB_URI;
  if (!uri && process.env.VERCEL) {
    return false;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const targetUri = uri || 'mongodb://127.0.0.1:27017/travel-planner';

  connectionPromise = mongoose
    .connect(targetUri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then((conn) => {
      console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
      return true;
    })
    .catch((error) => {
      console.warn(`[Database Warning] MongoDB connection failed (${error.message}).`);
      console.warn(`[Database Notice] Application will fall back to resilient in-memory data mode for uninterrupted operation.`);
      connectionPromise = null;
      return false;
    });

  return connectionPromise;
};

const getDBStatus = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, getDBStatus };

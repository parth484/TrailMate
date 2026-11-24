const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Core Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Ensure database connection is initialized before handling API requests (critical for serverless cold starts)
app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
});

// Base Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Travel Planner API Server Running',
    database: getDBStatus() ? 'mongodb' : 'in-memory',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/itinerary', require('./routes/itineraryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] Travel Planner Express API listening on port ${PORT}`);
  });
}

module.exports = app;

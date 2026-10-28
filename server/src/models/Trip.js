const mongoose = require('mongoose');

const inMemoryTrips = [];

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    country: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    travelers: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Planning', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    },
    lat: {
      type: Number,
      default: 48.8566,
    },
    lng: {
      type: Number,
      default: 2.3522,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

module.exports = Trip;
module.exports.inMemoryTrips = inMemoryTrips;

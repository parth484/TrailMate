const mongoose = require('mongoose');

const inMemoryItineraries = [];

const activitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Sightseeing', 'Food & Dining', 'Transit', 'Shopping', 'Adventure', 'Relaxation', 'Other'],
    default: 'Sightseeing'
  },
  cost: { type: Number, default: 0 },
  locationName: { type: String, default: '' },
  notes: { type: String, default: '' }
});

const itinerarySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activities: [activitySchema],
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
module.exports.inMemoryItineraries = inMemoryItineraries;

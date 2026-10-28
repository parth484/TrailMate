const Trip = require('../models/Trip');
const { inMemoryTrips } = require('../models/Trip');
const Expense = require('../models/Expense');
const { inMemoryExpenses } = require('../models/Expense');
const { getDBStatus } = require('../config/db');

// Indian Adventure Destinations geocoding helper map
const CITY_COORDS = {
  rishikesh: { lat: 30.0869, lng: 78.2676, country: 'India', coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800' },
  manali: { lat: 32.2432, lng: 77.1892, country: 'India', coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
  ladakh: { lat: 34.1526, lng: 77.5771, country: 'India', coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800' },
  leh: { lat: 34.1526, lng: 77.5771, country: 'India', coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800' },
  goa: { lat: 15.2993, lng: 74.1240, country: 'India', coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800' },
  auli: { lat: 30.5280, lng: 79.5670, country: 'India', coverImage: 'https://images.unsplash.com/photo-1605649487212-47bdab06cfdf?w=800' },
  'bir billing': { lat: 32.0469, lng: 76.7161, country: 'India', coverImage: 'https://images.unsplash.com/photo-1508672019048-805479767513?w=800' },
  meghalaya: { lat: 25.4670, lng: 91.3662, country: 'India', coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800' },
  shillong: { lat: 25.5788, lng: 91.8933, country: 'India', coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800' },
  spiti: { lat: 32.2461, lng: 78.0349, country: 'India', coverImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800' },
  dandeli: { lat: 15.2361, lng: 74.6175, country: 'India', coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800' },
  coorg: { lat: 12.3375, lng: 75.8069, country: 'India', coverImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800' },
  andaman: { lat: 11.7401, lng: 92.6586, country: 'India', coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
  delhi: { lat: 28.6139, lng: 77.2090, country: 'India', coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  'new delhi': { lat: 28.6139, lng: 77.2090, country: 'India', coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  mumbai: { lat: 19.0760, lng: 72.8777, country: 'India', coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800' },
  shimla: { lat: 31.1048, lng: 77.1734, country: 'India', coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
};

// Asynchronous geocoder using OpenStreetMap Nominatim API with dictionary fallback
const geocodeDestination = async (destinationName) => {
  if (!destinationName) return null;
  const lower = destinationName.toLowerCase().trim();
  if (CITY_COORDS[lower]) return CITY_COORDS[lower];

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationName)}`, {
      headers: { 'User-Agent': 'TravelPlannerApp/1.0' }
    });
    const results = await response.json();
    if (results && results.length > 0) {
      const best = results[0];
      const parts = (best.display_name || '').split(',');
      const detectedCountry = parts.length > 0 ? parts[parts.length - 1].trim() : '';
      return {
        lat: parseFloat(best.lat),
        lng: parseFloat(best.lon),
        country: detectedCountry || 'Global'
      };
    }
  } catch (error) {
    console.warn('[Geocoding] Nominatim lookup error:', error.message);
  }
  return null;
};

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const trips = await Trip.find({ user: userId }).sort({ startDate: 1 });
      return res.json(trips);
    } else {
      const trips = inMemoryTrips.filter(t => t.user === userId || t.user.toString() === userId.toString());
      return res.json(trips);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const trip = await Trip.findById(id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      if (trip.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      return res.json(trip);
    } else {
      const trip = inMemoryTrips.find(t => t._id === id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.json(trip);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const { destination, country, startDate, endDate, budget, currency, travelers, status, coverImage, lat, lng } = req.body;
    const userId = req.user._id || req.user.id;

    const lowerDest = (destination || '').toLowerCase().trim();
    const cityInfo = CITY_COORDS[lowerDest] || (await geocodeDestination(destination)) || {};

    const tripData = {
      user: userId,
      destination,
      country: country || cityInfo.country || 'Global',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: Number(budget) || 0,
      currency: currency || 'USD',
      travelers: Number(travelers) || 1,
      status: status || 'Planning',
      coverImage: coverImage || cityInfo.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      lat: Number(lat) || cityInfo.lat || 28.6139,
      lng: Number(lng) || cityInfo.lng || 77.2090,
    };

    if (getDBStatus()) {
      const newTrip = await Trip.create(tripData);
      return res.status(201).json(newTrip);
    } else {
      const newTrip = {
        _id: 'trip_' + Date.now(),
        ...tripData,
        createdAt: new Date(),
      };
      inMemoryTrips.push(newTrip);
      return res.status(201).json(newTrip);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    let updateData = { ...req.body };
    if (updateData.destination) {
      const lowerDest = updateData.destination.toLowerCase().trim();
      const cityInfo = CITY_COORDS[lowerDest] || (await geocodeDestination(updateData.destination)) || {};
      if (cityInfo.lat && cityInfo.lng) {
        if (!updateData.lat) updateData.lat = cityInfo.lat;
        if (!updateData.lng) updateData.lng = cityInfo.lng;
        if (!updateData.country && cityInfo.country) updateData.country = cityInfo.country;
      }
    }

    if (getDBStatus()) {
      const trip = await Trip.findById(id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      if (trip.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.assign(trip, updateData);
      const updatedTrip = await trip.save();
      return res.json(updatedTrip);
    } else {
      const index = inMemoryTrips.findIndex(t => t._id === id);
      if (index === -1) return res.status(404).json({ message: 'Trip not found' });

      inMemoryTrips[index] = {
        ...inMemoryTrips[index],
        ...updateData,
        updatedAt: new Date(),
      };
      return res.json(inMemoryTrips[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const trip = await Trip.findById(id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      if (trip.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await Trip.findByIdAndDelete(id);
      return res.json({ message: 'Trip deleted successfully', id });
    } else {
      const index = inMemoryTrips.findIndex(t => t._id === id);
      if (index === -1) return res.status(404).json({ message: 'Trip not found' });
      inMemoryTrips.splice(index, 1);
      return res.json({ message: 'Trip deleted successfully', id });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/trips/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let trips = [];
    let expenses = [];

    if (getDBStatus()) {
      trips = await Trip.find({ user: userId });
      const tripIds = trips.map(t => t._id);
      expenses = await Expense.find({ trip: { $in: tripIds } });
    } else {
      trips = inMemoryTrips.filter(t => t.user === userId || t.user.toString() === userId.toString());
      const tripIds = trips.map(t => t._id);
      expenses = inMemoryExpenses.filter(e => tripIds.includes(e.trip));
    }

    const totalTrips = trips.length;
    const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
    const totalSpent = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const upcomingTripsCount = trips.filter(t => t.status === 'Planning' || new Date(t.startDate) > new Date()).length;
    const completedTripsCount = trips.filter(t => t.status === 'Completed').length;

    return res.json({
      totalTrips,
      totalBudget,
      totalSpent,
      upcomingTripsCount,
      completedTripsCount,
      remainingBudget: Math.max(0, totalBudget - totalSpent),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip, getDashboardStats };

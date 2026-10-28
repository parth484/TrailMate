const Itinerary = require('../models/Itinerary');
const { inMemoryItineraries } = require('../models/Itinerary');
const Trip = require('../models/Trip');
const { inMemoryTrips } = require('../models/Trip');
const { getDBStatus } = require('../config/db');

// @desc    Get trip itineraries
// @route   GET /api/itinerary/trip/:tripId
// @access  Private
const getItinerariesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (getDBStatus()) {
      let itineraries = await Itinerary.find({ trip: tripId }).sort({ dayNumber: 1 });
      
      // Auto-generate days if none exist yet based on trip duration
      if (itineraries.length === 0) {
        const trip = await Trip.findById(tripId);
        if (trip) {
          const start = new Date(trip.startDate);
          const end = new Date(trip.endDate);
          const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

          for (let i = 1; i <= Math.min(dayCount, 14); i++) {
            const dayDate = new Date(start);
            dayDate.setDate(start.getDate() + (i - 1));

            const newDay = await Itinerary.create({
              trip: tripId,
              dayNumber: i,
              date: dayDate,
              activities: [
                {
                  time: '09:00 AM',
                  title: `Morning Exploration - Day ${i}`,
                  category: 'Sightseeing',
                  cost: 0,
                  locationName: trip.destination,
                  notes: 'Check out key attractions and local sights.'
                }
              ]
            });
            itineraries.push(newDay);
          }
        }
      }
      return res.json(itineraries);
    } else {
      let itineraries = inMemoryItineraries.filter(i => i.trip === tripId || i.trip.toString() === tripId.toString());
      if (itineraries.length === 0) {
        const trip = inMemoryTrips.find(t => t._id === tripId);
        if (trip) {
          const start = new Date(trip.startDate);
          const end = new Date(trip.endDate);
          const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

          for (let i = 1; i <= Math.min(dayCount, 14); i++) {
            const dayDate = new Date(start);
            dayDate.setDate(start.getDate() + (i - 1));

            const newDay = {
              _id: 'itin_' + Date.now() + '_' + i,
              trip: tripId,
              dayNumber: i,
              date: dayDate,
              activities: [
                {
                  _id: 'act_' + Date.now() + '_1',
                  time: '09:00 AM',
                  title: `Morning Exploration - Day ${i}`,
                  category: 'Sightseeing',
                  cost: 0,
                  locationName: trip.destination,
                  notes: 'Check out key attractions and local sights.'
                }
              ]
            };
            inMemoryItineraries.push(newDay);
            itineraries.push(newDay);
          }
        }
      }
      return res.json(itineraries);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add activity to itinerary day
// @route   POST /api/itinerary/:id/activity
// @access  Private
const addActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, title, category, cost, locationName, notes } = req.body;

    const newActivity = {
      time: time || '10:00 AM',
      title: title || 'New Activity',
      category: category || 'Sightseeing',
      cost: Number(cost) || 0,
      locationName: locationName || '',
      notes: notes || '',
    };

    if (getDBStatus()) {
      const itinerary = await Itinerary.findById(id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      itinerary.activities.push(newActivity);
      await itinerary.save();
      return res.json(itinerary);
    } else {
      const itinerary = inMemoryItineraries.find(i => i._id === id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      newActivity._id = 'act_' + Date.now();
      itinerary.activities.push(newActivity);
      return res.json(itinerary);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update activity in itinerary day
// @route   PUT /api/itinerary/:id/activity/:activityId
// @access  Private
const updateActivity = async (req, res) => {
  try {
    const { id, activityId } = req.params;

    if (getDBStatus()) {
      const itinerary = await Itinerary.findById(id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      const activity = itinerary.activities.id(activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });

      Object.assign(activity, req.body);
      await itinerary.save();
      return res.json(itinerary);
    } else {
      const itinerary = inMemoryItineraries.find(i => i._id === id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      const actIndex = itinerary.activities.findIndex(a => a._id === activityId);
      if (actIndex === -1) return res.status(404).json({ message: 'Activity not found' });

      itinerary.activities[actIndex] = {
        ...itinerary.activities[actIndex],
        ...req.body,
      };
      return res.json(itinerary);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete activity from itinerary day
// @route   DELETE /api/itinerary/:id/activity/:activityId
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const { id, activityId } = req.params;

    if (getDBStatus()) {
      const itinerary = await Itinerary.findById(id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      itinerary.activities = itinerary.activities.filter(a => a._id.toString() !== activityId.toString());
      await itinerary.save();
      return res.json(itinerary);
    } else {
      const itinerary = inMemoryItineraries.find(i => i._id === id);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

      itinerary.activities = itinerary.activities.filter(a => a._id !== activityId);
      return res.json(itinerary);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItinerariesByTrip, addActivity, updateActivity, deleteActivity };

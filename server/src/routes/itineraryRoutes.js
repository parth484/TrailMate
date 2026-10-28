const express = require('express');
const router = express.Router();
const { getItinerariesByTrip, addActivity, updateActivity, deleteActivity } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/trip/:tripId', getItinerariesByTrip);
router.post('/:id/activity', addActivity);
router.put('/:id/activity/:activityId', updateActivity);
router.delete('/:id/activity/:activityId', deleteActivity);

module.exports = router;

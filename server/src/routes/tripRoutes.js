const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTrips, getTripById, createTrip, updateTrip, deleteTrip, getDashboardStats } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/', getTrips);
router.get('/:id', getTripById);

router.post(
  '/',
  [
    body('destination', 'Destination is required').notEmpty(),
    body('startDate', 'Start date is required').notEmpty(),
    body('endDate', 'End date is required').notEmpty(),
    body('budget', 'Budget must be a positive number').isNumeric(),
  ],
  validate,
  createTrip
);

router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;

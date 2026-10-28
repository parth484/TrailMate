const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getExpensesByTrip, addExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/trip/:tripId', getExpensesByTrip);
router.post(
  '/',
  [
    body('tripId', 'Trip ID is required').notEmpty(),
    body('title', 'Expense title is required').notEmpty(),
    body('amount', 'Amount must be numeric').isNumeric(),
  ],
  validate,
  addExpense
);
router.delete('/:id', deleteExpense);

module.exports = router;

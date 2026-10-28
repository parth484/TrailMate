const Expense = require('../models/Expense');
const { inMemoryExpenses } = require('../models/Expense');
const Trip = require('../models/Trip');
const { inMemoryTrips } = require('../models/Trip');
const { getDBStatus } = require('../config/db');

// @desc    Get expenses for a trip
// @route   GET /api/expenses/trip/:tripId
// @access  Private
const getExpensesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (getDBStatus()) {
      const expenses = await Expense.find({ trip: tripId }).sort({ date: -1 });
      const trip = await Trip.findById(tripId);

      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      const budget = trip ? trip.budget : 0;
      const remaining = Math.max(0, budget - totalSpent);

      return res.json({
        expenses,
        totalSpent,
        budget,
        remaining,
      });
    } else {
      const expenses = inMemoryExpenses.filter(e => e.trip === tripId || e.trip.toString() === tripId.toString());
      const trip = inMemoryTrips.find(t => t._id === tripId);

      const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      const budget = trip ? Number(trip.budget || 0) : 0;
      const remaining = Math.max(0, budget - totalSpent);

      return res.json({
        expenses,
        totalSpent,
        budget,
        remaining,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { tripId, title, amount, category, date, notes } = req.body;

    if (!tripId || !title || !amount) {
      return res.status(400).json({ message: 'Please provide trip, title and amount' });
    }

    const expenseData = {
      trip: tripId,
      title,
      amount: Number(amount),
      category: category || 'Other',
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    };

    if (getDBStatus()) {
      const expense = await Expense.create(expenseData);
      return res.status(201).json(expense);
    } else {
      const expense = {
        _id: 'exp_' + Date.now(),
        ...expenseData,
        createdAt: new Date(),
      };
      inMemoryExpenses.push(expense);
      return res.status(201).json(expense);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const expense = await Expense.findById(id);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });

      await Expense.findByIdAndDelete(id);
      return res.json({ message: 'Expense removed', id });
    } else {
      const index = inMemoryExpenses.findIndex(e => e._id === id);
      if (index === -1) return res.status(404).json({ message: 'Expense not found' });

      inMemoryExpenses.splice(index, 1);
      return res.json({ message: 'Expense removed', id });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpensesByTrip, addExpense, deleteExpense };

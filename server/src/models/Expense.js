const mongoose = require('mongoose');

const inMemoryExpenses = [];

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    category: {
      type: String,
      enum: ['Accommodation', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'],
      default: 'Other',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

module.exports = Expense;
module.exports.inMemoryExpenses = inMemoryExpenses;

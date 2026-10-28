import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import * as expenseService from '../services/expenseService';
import BudgetSummary from '../components/budget/BudgetSummary';
import ExpenseCategoryChart from '../components/budget/ExpenseCategoryChart';
import ExpenseList from '../components/budget/ExpenseList';
import ExpenseFormModal from '../components/budget/ExpenseFormModal';
import { Wallet, Plus, DollarSign } from 'lucide-react';

const BudgetPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTripId = searchParams.get('tripId');

  const { trips, fetchTrips } = useTrips();
  const [activeTripId, setActiveTripId] = useState(selectedTripId || '');
  const [expenseData, setExpenseData] = useState({ expenses: [], totalSpent: 0, budget: 0, remaining: 0 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0 && !activeTripId) {
      setActiveTripId(trips[0]._id);
    }
  }, [trips, activeTripId]);

  useEffect(() => {
    if (activeTripId) {
      loadExpenses(activeTripId);
    }
  }, [activeTripId]);

  const loadExpenses = async (tripId) => {
    setLoading(true);
    try {
      const data = await expenseService.getExpensesByTrip(tripId);
      setExpenseData(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripChange = (e) => {
    const id = e.target.value;
    setActiveTripId(id);
    setSearchParams({ tripId: id });
  };

  const handleAddExpense = async (data) => {
    await expenseService.addExpense(data);
    loadExpenses(activeTripId);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Remove this expense item?')) {
      await expenseService.deleteExpense(expenseId);
      loadExpenses(activeTripId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            Budget & Expense Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor spending limits, categorized expenses & real-time balance
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {trips.length > 0 && (
            <select
              value={activeTripId}
              onChange={handleTripChange}
              className="w-full sm:w-60 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.destination} (${t.budget})
                </option>
              ))}
            </select>
          )}

          {activeTripId && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3">Calculating budget metrics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <BudgetSummary
              budget={expenseData.budget}
              totalSpent={expenseData.totalSpent}
              remaining={expenseData.remaining}
            />
            <ExpenseCategoryChart expenses={expenseData.expenses} />
          </div>

          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenseData.expenses}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      )}

      {/* Expense Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
        tripId={activeTripId}
      />
    </div>
  );
};

export default BudgetPage;

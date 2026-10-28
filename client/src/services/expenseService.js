import API from './api';

export const getExpensesByTrip = async (tripId) => {
  const response = await API.get(`/expenses/trip/${tripId}`);
  return response.data;
};

export const addExpense = async (expenseData) => {
  const response = await API.post('/expenses', expenseData);
  return response.data;
};

export const deleteExpense = async (expenseId) => {
  const response = await API.delete(`/expenses/${expenseId}`);
  return response.data;
};

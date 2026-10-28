import API from './api';

export const getTrips = async () => {
  const response = await API.get('/trips');
  return response.data;
};

export const getTripById = async (id) => {
  const response = await API.get(`/trips/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get('/trips/stats');
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await API.post('/trips', tripData);
  return response.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await API.put(`/trips/${id}`, tripData);
  return response.data;
};

export const deleteTrip = async (id) => {
  const response = await API.delete(`/trips/${id}`);
  return response.data;
};

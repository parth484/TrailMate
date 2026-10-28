import API from './api';

export const getItinerariesByTrip = async (tripId) => {
  const response = await API.get(`/itinerary/trip/${tripId}`);
  return response.data;
};

export const addActivity = async (itineraryId, activityData) => {
  const response = await API.post(`/itinerary/${itineraryId}/activity`, activityData);
  return response.data;
};

export const updateActivity = async (itineraryId, activityId, activityData) => {
  const response = await API.put(`/itinerary/${itineraryId}/activity/${activityId}`, activityData);
  return response.data;
};

export const deleteActivity = async (itineraryId, activityId) => {
  const response = await API.delete(`/itinerary/${itineraryId}/activity/${activityId}`);
  return response.data;
};

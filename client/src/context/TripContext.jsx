import React, { createContext, useContext, useState, useCallback } from 'react';
import * as tripService from '../services/tripService';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await tripService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const fetchTripById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await tripService.getTripById(id);
      setActiveTrip(data);
      return data;
    } catch (err) {
      console.error('Error fetching trip by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = async (tripData) => {
    const newTrip = await tripService.createTrip(tripData);
    setTrips(prev => [newTrip, ...prev]);
    fetchStats();
    return newTrip;
  };

  const updateTrip = async (id, tripData) => {
    const updated = await tripService.updateTrip(id, tripData);
    setTrips(prev => prev.map(t => (t._id === id ? updated : t)));
    if (activeTrip && activeTrip._id === id) {
      setActiveTrip(updated);
    }
    fetchStats();
    return updated;
  };

  const deleteTrip = async (id) => {
    await tripService.deleteTrip(id);
    setTrips(prev => prev.filter(t => t._id !== id));
    if (activeTrip && activeTrip._id === id) {
      setActiveTrip(null);
    }
    fetchStats();
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        stats,
        loading,
        fetchTrips,
        fetchStats,
        fetchTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        setActiveTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);

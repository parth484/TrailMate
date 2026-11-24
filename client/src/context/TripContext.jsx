import React, { createContext, useContext, useState, useCallback } from 'react';
import * as tripService from '../services/tripService';
import { toSafeArray, isPlainObject, safeReadStorage } from '../utils/safeData';

const TRIPS_STORAGE_KEY = 'trailmate_trips';
const TripContext = createContext();

const computeStatsFromTrips = (tripList) => {
  const safeTrips = toSafeArray(tripList);
  const totalTrips = safeTrips.length;
  const totalBudget = safeTrips.reduce((acc, t) => acc + Number(t?.budget || 0), 0);
  const upcomingTripsCount = safeTrips.filter(
    (t) => t?.status === 'Planning' || (t?.startDate && new Date(t.startDate) > new Date())
  ).length;
  const completedTripsCount = safeTrips.filter((t) => t?.status === 'Completed').length;

  return {
    totalTrips,
    totalBudget,
    totalSpent: 0,
    upcomingTripsCount,
    completedTripsCount,
    remainingBudget: totalBudget,
  };
};

const saveTripsToStorage = (tripList) => {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(toSafeArray(tripList)));
  } catch {
    // Ignore storage quota errors
  }
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tripService.getTrips();
      const normalized = toSafeArray(data);
      setTrips(normalized);
      saveTripsToStorage(normalized);
    } catch (err) {
      console.warn('Error fetching trips, using local fallback:', err.message);
      const localTrips = safeReadStorage(TRIPS_STORAGE_KEY, [], Array.isArray);
      setTrips(toSafeArray(localTrips));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await tripService.getDashboardStats();
      if (isPlainObject(data)) {
        setStats(data);
      } else {
        const localTrips = safeReadStorage(TRIPS_STORAGE_KEY, [], Array.isArray);
        setStats(computeStatsFromTrips(localTrips));
      }
    } catch (err) {
      console.warn('Error fetching stats, computing locally:', err.message);
      const localTrips = safeReadStorage(TRIPS_STORAGE_KEY, [], Array.isArray);
      setStats(computeStatsFromTrips(localTrips));
    }
  }, []);

  const fetchTripById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await tripService.getTripById(id);
      if (isPlainObject(data)) {
        setActiveTrip(data);
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Error fetching trip by ID, checking local fallback:', err.message);
      const localTrips = safeReadStorage(TRIPS_STORAGE_KEY, [], Array.isArray);
      const found = toSafeArray(localTrips).find((t) => t._id === id) || null;
      setActiveTrip(found);
      return found;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = async (tripData) => {
    try {
      const newTrip = await tripService.createTrip(tripData);
      if (!isPlainObject(newTrip)) {
        throw new Error('Invalid trip response');
      }
      setTrips((prev) => {
        const next = [newTrip, ...toSafeArray(prev)];
        saveTripsToStorage(next);
        return next;
      });
      fetchStats();
      return newTrip;
    } catch {
      const localTrip = {
        _id: 'local_trip_' + Date.now(),
        ...tripData,
        budget: Number(tripData.budget) || 0,
        travelers: Number(tripData.travelers) || 1,
        status: tripData.status || 'Planning',
        createdAt: new Date().toISOString(),
      };
      setTrips((prev) => {
        const next = [localTrip, ...toSafeArray(prev)];
        saveTripsToStorage(next);
        setStats(computeStatsFromTrips(next));
        return next;
      });
      return localTrip;
    }
  };

  const updateTrip = async (id, tripData) => {
    try {
      const updated = await tripService.updateTrip(id, tripData);
      if (!isPlainObject(updated)) {
        throw new Error('Invalid trip response');
      }
      setTrips((prev) => {
        const next = toSafeArray(prev).map((t) => (t._id === id ? updated : t));
        saveTripsToStorage(next);
        return next;
      });
      if (activeTrip && activeTrip._id === id) {
        setActiveTrip(updated);
      }
      fetchStats();
      return updated;
    } catch {
      let updatedTrip = null;
      setTrips((prev) => {
        const next = toSafeArray(prev).map((t) => {
          if (t._id === id) {
            updatedTrip = { ...t, ...tripData, updatedAt: new Date().toISOString() };
            return updatedTrip;
          }
          return t;
        });
        saveTripsToStorage(next);
        setStats(computeStatsFromTrips(next));
        return next;
      });
      if (activeTrip && activeTrip._id === id && updatedTrip) {
        setActiveTrip(updatedTrip);
      }
      return updatedTrip;
    }
  };

  const deleteTrip = async (id) => {
    try {
      await tripService.deleteTrip(id);
    } catch {
      // Proceed with local removal if API is unavailable
    }
    setTrips((prev) => {
      const next = toSafeArray(prev).filter((t) => t._id !== id);
      saveTripsToStorage(next);
      setStats(computeStatsFromTrips(next));
      return next;
    });
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

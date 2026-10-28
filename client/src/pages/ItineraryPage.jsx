import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import * as itineraryService from '../services/itineraryService';
import DayView from '../components/itinerary/DayView';
import ActivityFormModal from '../components/itinerary/ActivityFormModal';
import { CalendarRange, Compass, Plus } from 'lucide-react';

const ItineraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTripId = searchParams.get('tripId');

  const { trips, fetchTrips } = useTrips();
  const [activeTripId, setActiveTripId] = useState(selectedTripId || '');
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [targetItineraryId, setTargetItineraryId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

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
      loadItineraries(activeTripId);
    }
  }, [activeTripId]);

  const loadItineraries = async (tripId) => {
    setLoading(true);
    try {
      const data = await itineraryService.getItinerariesByTrip(tripId);
      setItineraries(data);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripChange = (e) => {
    const id = e.target.value;
    setActiveTripId(id);
    setSearchParams({ tripId: id });
  };

  const handleOpenAddActivity = (itineraryId) => {
    setTargetItineraryId(itineraryId);
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (itineraryId, activity) => {
    setTargetItineraryId(itineraryId);
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSubmitActivity = async (activityData) => {
    if (editingActivity) {
      await itineraryService.updateActivity(targetItineraryId, editingActivity._id, activityData);
    } else {
      await itineraryService.addActivity(targetItineraryId, activityData);
    }
    loadItineraries(activeTripId);
  };

  const handleDeleteActivity = async (itineraryId, activityId) => {
    if (window.confirm('Delete this activity from itinerary?')) {
      await itineraryService.deleteActivity(itineraryId, activityId);
      loadItineraries(activeTripId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-sky-500" />
            Day-Wise Itinerary Planner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize daily sight-seeing, activities, notes & times for your trips
          </p>
        </div>

        {trips.length > 0 && (
          <div className="w-full sm:w-auto">
            <select
              value={activeTripId}
              onChange={handleTripChange}
              className="w-full sm:w-64 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.destination} ({t.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3">Loading day itineraries...</p>
        </div>
      ) : itineraries.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Active Trip Selected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please select or create a trip to start building your day-by-day itinerary.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itineraries.map((day) => (
            <DayView
              key={day._id}
              day={day}
              onAddActivity={handleOpenAddActivity}
              onEditActivity={handleOpenEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          ))}
        </div>
      )}

      {/* Activity Form Modal */}
      <ActivityFormModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleSubmitActivity}
        initialData={editingActivity}
      />
    </div>
  );
};

export default ItineraryPage;

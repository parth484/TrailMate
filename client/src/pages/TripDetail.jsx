import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { fetchWeatherByCoords } from '../services/weatherService';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastList from '../components/weather/ForecastList';
import MapView from '../components/map/MapView';
import { MapPin, Calendar, Users, DollarSign, ArrowLeft, CalendarRange, Wallet, Edit, Trash2 } from 'lucide-react';
import TripFormModal from '../components/trips/TripFormModal';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTripById, updateTrip, deleteTrip } = useTrips();

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadTripData = async () => {
      setLoading(true);
      const data = await fetchTripById(id);
      if (data) {
        setTrip(data);
        const wData = await fetchWeatherByCoords(data.lat || 48.8566, data.lng || 2.3522);
        setWeather(wData);
      }
      setLoading(false);
    };
    loadTripData();
  }, [id, fetchTripById]);

  const handleEditSubmit = async (formData) => {
    const updated = await updateTrip(id, formData);
    setTrip(updated);
  };

  const handleDeleteTrip = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(id);
      navigate('/trips');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
        <p className="text-xs text-slate-400 mt-3">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold">Trip Not Found</h3>
        <Link to="/trips" className="inline-block px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold">
          Return to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <Link to="/trips" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-500">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Trip
          </button>
          <button
            onClick={handleDeleteTrip}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-lg">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-white">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/80 backdrop-blur-md mb-2 inline-block">
              {trip.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-2">
              <MapPin className="w-7 h-7 text-sky-400" />
              {trip.destination}
            </h1>
            <p className="text-sm text-slate-300 font-medium ml-9">{trip.country || 'Global'}</p>
          </div>

          <div className="flex items-center gap-4 text-xs bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>
                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">${trip.budget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to={`/itinerary?tripId=${trip._id}`}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-500 transition-colors">
                Day-Wise Itinerary
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Plan schedule and activity list</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/budget?tripId=${trip._id}`}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                Budget Tracker
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Log expenses and view stats</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Weather & Interactive Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WeatherCard destination={trip.destination} weather={weather} />
          {weather && <ForecastList forecast={weather.forecast} />}
        </div>

        <MapView
          lat={trip.lat || 48.8566}
          lng={trip.lng || 2.3522}
          destination={trip.destination}
        />
      </div>

      {/* Edit Modal */}
      <TripFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={trip}
      />
    </div>
  );
};

export default TripDetail;

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowRight } from 'lucide-react';

const UpcomingTripsList = ({ trips = [] }) => {
  const upcoming = trips.filter(t => t.status === 'Planning' || t.status === 'Ongoing');

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          Upcoming & Active Trips
        </h3>
        <Link to="/trips" className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No upcoming trips scheduled yet.</p>
          <Link to="/trips" className="inline-block mt-3 px-4 py-2 text-xs font-semibold bg-sky-500 text-white rounded-xl shadow">
            + Create New Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.slice(0, 4).map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div className="h-32 w-full relative">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/80 backdrop-blur-md text-white">
                  {trip.status}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-bold text-lg leading-tight flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    {trip.destination}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">{trip.country}</p>
                </div>
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                  {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-200">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTripsList;

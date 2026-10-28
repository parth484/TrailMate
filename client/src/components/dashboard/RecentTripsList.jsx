import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign } from 'lucide-react';

const RecentTripsList = ({ trips = [] }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-500" />
        Recent Destinations
      </h3>

      {trips.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          No trip history recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {trips.slice(0, 5).map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                  alt={trip.destination}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h5 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {trip.destination}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    {trip.country || 'Global'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  ${trip.budget}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  trip.status === 'Completed' ? 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300' :
                  trip.status === 'Ongoing' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {trip.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTripsList;

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, Edit, Trash2, MapPin, ArrowRight } from 'lucide-react';

const TripCard = ({ trip, onEdit, onDelete }) => {
  return (
    <div className="group glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md text-white ${
            trip.status === 'Completed' ? 'bg-purple-600/80' :
            trip.status === 'Ongoing' ? 'bg-amber-600/80' :
            trip.status === 'Cancelled' ? 'bg-rose-600/80' :
            'bg-sky-600/80'
          }`}>
            {trip.status}
          </span>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(trip)}
              className="p-1.5 rounded-xl bg-slate-900/60 backdrop-blur-md text-white hover:bg-sky-500 transition-colors"
              title="Edit Trip"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(trip._id)}
              className="p-1.5 rounded-xl bg-slate-900/60 backdrop-blur-md text-white hover:bg-rose-500 transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 text-white">
          <h4 className="font-extrabold text-xl leading-tight flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-sky-400" />
            {trip.destination}
          </h4>
          <p className="text-xs text-slate-300 font-medium">{trip.country}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>
              {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 justify-end">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>{trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Budget
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              ${trip.budget.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/trips/${trip._id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;

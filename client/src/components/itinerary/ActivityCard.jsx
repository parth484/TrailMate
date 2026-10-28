import React from 'react';
import { Clock, MapPin, DollarSign, Edit, Trash2, Tag, FileText } from 'lucide-react';

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const categoryColors = {
    Sightseeing: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    'Food & Dining': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Transit: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    Shopping: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    Adventure: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Relaxation: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    Other: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <div className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              {activity.time}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${categoryColors[activity.category] || categoryColors.Other}`}>
              {activity.category}
            </span>
          </div>

          <h5 className="font-bold text-base text-slate-900 dark:text-slate-100 pt-1">
            {activity.title}
          </h5>
        </div>

        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(activity)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(activity._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {(activity.locationName || activity.notes || activity.cost > 0) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          {activity.locationName && (
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {activity.locationName}
            </span>
          )}

          {activity.notes && (
            <span className="flex items-center gap-1 italic">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {activity.notes}
            </span>
          )}

          {activity.cost > 0 && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center ml-auto">
              +${activity.cost}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;

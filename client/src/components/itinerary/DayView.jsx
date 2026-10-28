import React from 'react';
import ActivityCard from './ActivityCard';
import { Plus, Calendar } from 'lucide-react';

const DayView = ({ day, onAddActivity, onEditActivity, onDeleteActivity }) => {
  const formattedDate = new Date(day.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-500">
            Day {day.dayNumber}
          </span>
          <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {formattedDate}
          </h4>
        </div>

        <button
          onClick={() => onAddActivity(day._id)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Activity
        </button>
      </div>

      {day.activities && day.activities.length > 0 ? (
        <div className="space-y-3">
          {day.activities.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={(act) => onEditActivity(day._id, act)}
              onDelete={(actId) => onDeleteActivity(day._id, actId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No activities scheduled for this day yet.
          </p>
          <button
            onClick={() => onAddActivity(day._id)}
            className="mt-2 text-xs font-semibold text-sky-500 hover:underline"
          >
            + Add First Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default DayView;

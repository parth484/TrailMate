import React from 'react';
import { Calendar } from 'lucide-react';
import { getWeatherDescription } from '../../services/weatherService';

const ForecastList = ({ forecast = [] }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-sky-500" />
        5-Day Forecast
      </h4>

      <div className="grid grid-cols-5 gap-2">
        {forecast.map((item, index) => {
          const desc = getWeatherDescription(item.weatherCode);
          return (
            <div
              key={index}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-1"
            >
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                {typeof item.date === 'string' && item.date.includes('-')
                  ? new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })
                  : item.date}
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                {item.maxTemp}° / {item.minTemp}°
              </span>
              <span className="text-[10px] text-sky-500 block truncate">
                {desc.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;

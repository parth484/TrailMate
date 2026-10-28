import React from 'react';
import { Sun, CloudSun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { getWeatherDescription } from '../../services/weatherService';

const WeatherCard = ({ destination, weather }) => {
  if (!weather) return null;

  const desc = getWeatherDescription(weather.weatherCode);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-purple-500/10 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
            Live Weather
          </span>
          <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {destination}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {desc.label}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
          <Sun className="w-7 h-7 animate-spin-slow" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-rose-500" />
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {weather.temp}°C
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Wind className="w-4 h-4 text-sky-500" />
          <span>{weather.windSpeed} km/h wind</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

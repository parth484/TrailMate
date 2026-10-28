import React from 'react';
import { Search, Compass } from 'lucide-react';

const PlacesSearch = ({ activeCategory, setActiveCategory, searchCity, setSearchCity }) => {
  const categories = [
    { label: 'All Places', value: 'All' },
    { label: 'Attractions', value: 'Attraction' },
    { label: 'Restaurants', value: 'Restaurant' },
    { label: 'Hotels', value: 'Hotel' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Enter city (e.g. Paris, Tokyo, London)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-800/80 w-full sm:w-auto overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.value
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlacesSearch;

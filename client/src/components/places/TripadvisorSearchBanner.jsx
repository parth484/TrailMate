import React, { useState } from 'react';
import { Search, Calendar, MapPin, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { searchLocationGeoId, searchHotelsByGeoId } from '../../services/tripadvisorService';

const TripadvisorSearchBanner = ({ onSearchResults, onClearSearch, currentCity }) => {
  // Default to today + 2 days and today + 5 days (YYYY-MM-DD)
  const getInitialDates = () => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 2);
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 5);
    return {
      checkIn: d1.toISOString().split('T')[0],
      checkOut: d2.toISOString().split('T')[0],
    };
  };

  const initialDates = getInitialDates();
  const [cityInput, setCityInput] = useState(currentCity || 'Pune');
  const [checkIn, setCheckIn] = useState(initialDates.checkIn);
  const [checkOut, setCheckOut] = useState(initialDates.checkOut);
  const [loading, setLoading] = useState(false);
  const [searchMeta, setSearchMeta] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleTripadvisorSearch = async (e) => {
    if (e) e.preventDefault();
    const q = cityInput.trim();
    if (!q) return;

    if (!checkIn || !checkOut) {
      setErrorMsg('Please select both Check-In and Check-Out dates');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Check-Out date must be after Check-In date');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSearchMeta(null);

    try {
      // Step 1: Call /api/v1/hotels/searchLocation with city input to retrieve geoId
      const locData = await searchLocationGeoId(q);
      if (!locData || !locData.geoId) {
        setErrorMsg(`No destination found for "${q}" on Tripadvisor. Try another city.`);
        setLoading(false);
        return;
      }

      const geoId = locData.geoId;
      const resolvedTitle = locData.title || q;

      // Step 2: Call /api/v1/hotels/searchHotels with geoId, checkIn, checkOut
      const hotels = await searchHotelsByGeoId(geoId, checkIn, checkOut, resolvedTitle);

      setSearchMeta({
        geoId,
        city: resolvedTitle,
        count: hotels.length,
        checkIn,
        checkOut,
      });

      if (onSearchResults) {
        onSearchResults(hotels, {
          city: resolvedTitle,
          geoId,
          checkIn,
          checkOut,
        });
      }
    } catch (err) {
      console.error('Tripadvisor Search Error:', err);
      setErrorMsg(err.message || 'Failed to search hotels via Tripadvisor');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchMeta(null);
    setErrorMsg(null);
    if (onClearSearch) onClearSearch();
  };

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 p-6 sm:p-8 shadow-xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Tripadvisor Live Integration (RapidAPI)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Search Hotels with Real-Time Rates & Photos
            </h2>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-emerald-300">
              Flow: /searchLocation (geoId) ➔ /searchHotels
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTripadvisorSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* City Input */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Destination City
            </label>
            <div className="relative">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g. Pune, Mumbai, Goa, Delhi, Rishikesh..."
                className="w-full pl-4 pr-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Check-In Date */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
          </div>

          {/* Check-Out Date */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
          </div>

          {/* Search Button */}
          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Search Tripadvisor"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Live Search Result Meta Banner */}
        {searchMeta && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Found <strong>{searchMeta.count} hotels</strong> in <strong>{searchMeta.city}</strong> (Tripadvisor GeoId: <code className="font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded">{searchMeta.geoId}</code>) for <strong>{searchMeta.checkIn}</strong> to <strong>{searchMeta.checkOut}</strong>
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-400 hover:text-white underline underline-offset-4"
            >
              Show All Stays
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripadvisorSearchBanner;

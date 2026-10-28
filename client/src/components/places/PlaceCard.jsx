import React from 'react';
import { Star, MapPin, Utensils, Hotel, Camera, Tent, CalendarCheck, Wifi, Home, Info } from 'lucide-react';

const PlaceCard = ({ place, onSelectPlace, onBookHotel }) => {
  const getCategoryIcon = (cat) => {
    if (cat === 'Airbnb & Villa') return <Home className="w-4 h-4 text-emerald-500" />;
    if (cat === 'Restaurant') return <Utensils className="w-4 h-4 text-amber-500" />;
    if (cat === 'Hotel' || cat === 'Lodge') return <Hotel className="w-4 h-4 text-indigo-500" />;
    if (cat === 'Camping & Safaris' || cat === 'Camping') return <Tent className="w-4 h-4 text-emerald-500" />;
    return <Camera className="w-4 h-4 text-sky-500" />;
  };

  const isStayOption =
    place.category === 'Airbnb & Villa' ||
    place.category === 'Hotel' ||
    place.category === 'Lodge' ||
    place.category === 'Camping' ||
    place.category === 'Camping & Safaris' ||
    place.name?.toLowerCase().includes('hotel') ||
    place.name?.toLowerCase().includes('resort') ||
    place.name?.toLowerCase().includes('villa') ||
    place.name?.toLowerCase().includes('airbnb') ||
    place.name?.toLowerCase().includes('penthouse') ||
    place.name?.toLowerCase().includes('camp') ||
    place.name?.toLowerCase().includes('lodge');

  const cardImage =
    place.image ||
    place.coverImage ||
    (place.category === 'Airbnb & Villa'
      ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
      : isStayOption
      ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
      : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800');

  const getButtonText = () => {
    if (place.category === 'Airbnb & Villa') return 'Book Villa';
    if (place.category === 'Camping') return 'Book Tent';
    return 'Book Room';
  };

  const handleCardClick = () => {
    if (onSelectPlace) {
      onSelectPlace(place);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-2xl cursor-pointer"
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={cardImage}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md text-white border border-white/10 shadow-sm ${
              place.category === 'Airbnb & Villa' ? 'bg-emerald-600/90' : 'bg-slate-900/80'
            }`}>
              {getCategoryIcon(place.category)}
              {place.category}
            </span>
            {(place.source === 'Tripadvisor' || place.id?.startsWith('tripadvisor_')) && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
                🦉 Tripadvisor
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {place.rating || 4.8}
            {place.reviewsCount && (
              <span className="text-[10px] text-slate-300 font-normal">({place.reviewsCount})</span>
            )}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
          <h4 className="font-extrabold text-lg leading-snug line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {place.name}
          </h4>
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-400" /> View Photos
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          {/* Amenities Chips */}
          {place.amenities && place.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {place.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  ✓ {amenity}
                </span>
              ))}
              {place.amenities.length > 3 && (
                <span className="text-[10px] text-slate-400 font-medium px-1 py-0.5">
                  +{place.amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {place.difficulty && (
            <div className="pt-1">
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                place.difficulty === 'Extreme' ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30' :
                place.difficulty === 'Challenging' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' :
                'bg-sky-500/15 text-sky-500 border border-sky-500/30'
              }`}>
                ⚡ Difficulty: {place.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions & Price */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isStayOption ? 'Nightly Rate' : 'Price / Fees'}
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {place.priceRange || '₹1,500 / night'}
            </span>
          </div>

          {isStayOption ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onBookHotel) onBookHotel(place);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <CalendarCheck className="w-4 h-4" /> {getButtonText()}
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate max-w-[120px]">{place.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Star, MapPin, ExternalLink, CalendarCheck, ShieldCheck, Wifi, Coffee, Sparkles, Check, Home, Hotel, Tent, X, ChevronLeft, ChevronRight } from 'lucide-react';

const HotelDetailModal = ({ isOpen, onClose, hotel, onProceedToBooking }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [hotel]);

  if (!hotel) return null;

  // Real genuine gallery collection
  const mainImage = hotel.image || hotel.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000';
  const gallery = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [
    mainImage,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000',
  ];

  const isStayOption =
    hotel.category === 'Airbnb & Villa' ||
    hotel.category === 'Hotel' ||
    hotel.category === 'Lodge' ||
    hotel.category === 'Camping' ||
    hotel.name?.toLowerCase().includes('hotel') ||
    hotel.name?.toLowerCase().includes('resort') ||
    hotel.name?.toLowerCase().includes('villa') ||
    hotel.name?.toLowerCase().includes('camp');

  const externalUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + (hotel.city || ''))}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hotel.name}>
      <div className="space-y-5 animate-fade-in">
        {/* Main Genuine HD Image Display with Carousel controls */}
        <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900">
          <img
            src={gallery[activeImageIndex] || mainImage}
            alt={`${hotel.name} Photo ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                className="pointer-events-auto p-2 rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-emerald-500 transition-colors shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                className="pointer-events-auto p-2 rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-emerald-500 transition-colors shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow">
              {hotel.category === 'Airbnb & Villa' ? <Home className="w-3.5 h-3.5 text-emerald-400" /> : <Hotel className="w-3.5 h-3.5 text-sky-400" />}
              {hotel.category}
            </span>

            <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {hotel.rating || 4.9}
              {hotel.reviewsCount && (
                <span className="text-[10px] text-slate-300 font-normal">({hotel.reviewsCount} Reviews)</span>
              )}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end z-10">
            <div>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {hotel.address}
              </p>
            </div>
            <span className="text-base font-black text-emerald-400 bg-slate-900/80 px-3 py-1 rounded-xl backdrop-blur-md">
              {hotel.priceRange || '₹2,500 / night'}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Bar */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${
                  activeImageIndex === idx
                    ? 'border-emerald-500 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Description Info */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
            About {hotel.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {hotel.description}
          </p>
        </div>

        {/* Full Amenities Grid */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Featured Amenities & Facilities
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {(hotel.amenities || ['Free WiFi', 'Outdoor Pool', 'Breakfast', 'Spa & Wellness', 'Mountain View', 'Free Parking']).map((amenity, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stay Policies & Timings */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex justify-between text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Check-in:</span>
            <span>12:00 PM</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Check-out:</span>
            <span>11:00 AM</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Cancellation:</span>
            <span className="text-emerald-500 font-semibold">Free up to 48h</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-500 hover:underline font-semibold flex items-center gap-1"
          >
            Verify on Booking.com <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
            {isStayOption && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToBooking && onProceedToBooking(hotel);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <CalendarCheck className="w-4 h-4" /> Book Stay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HotelDetailModal;

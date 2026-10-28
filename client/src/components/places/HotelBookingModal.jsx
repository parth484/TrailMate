import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Calendar, Users, Hotel, CheckCircle, ExternalLink, ShieldCheck, Tag, Sparkles, MapPin } from 'lucide-react';
import * as expenseService from '../../services/expenseService';
import { useTrips } from '../../context/TripContext';

const HotelBookingModal = ({ isOpen, onClose, hotel }) => {
  const { trips } = useTrips();

  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Deluxe Room');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTripId, setSelectedTripId] = useState(trips.length > 0 ? trips[0]._id : '');

  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hotel) return null;

  // Image fallback
  const hotelImage =
    hotel.image ||
    hotel.coverImage ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  // Base nightly rate calculation
  const getNightlyRate = () => {
    if (hotel.pricePerNight) return hotel.pricePerNight;
    if (hotel.priceRange?.includes('₹')) {
      const match = hotel.priceRange.match(/\d[\d,]*/);
      if (match) return parseInt(match[0].replace(/,/g, ''), 10);
    }
    if (hotel.priceRange === '$$$$') return 12000;
    if (hotel.priceRange === '$$$') return 6500;
    if (hotel.priceRange === '$$') return 3200;
    return 1800;
  };

  const baseRate = getNightlyRate();
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

  const roomMultiplier =
    roomType.includes('Suite') ? 1.6 :
    roomType.includes('Luxury Safari Tent') ? 1.3 :
    roomType.includes('Family Cottage') ? 1.4 : 1.0;

  const subtotal = Math.round(baseRate * nights * roomMultiplier);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase().trim() === 'ADVENTURE10' || couponCode.toUpperCase().trim() === 'WANDER10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid coupon code. Try ADVENTURE10 for 10% discount!');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingId = 'HTL-BOOK-' + Math.floor(100000 + Math.random() * 900000);

    // Auto-save reservation cost into selected trip budget
    if (selectedTripId) {
      try {
        await expenseService.addExpense({
          tripId: selectedTripId,
          title: `Hotel Booking: ${hotel.name} (${nights} Nights)`,
          amount: totalPrice,
          category: 'Accommodation',
          date: checkIn,
          notes: `Booking Ref: ${bookingId} | Room: ${roomType} | Guests: ${guests}`,
        });
      } catch (err) {
        console.warn('Auto expense sync notice:', err);
      }
    }

    setBookingConfirmed({
      bookingId,
      hotelName: hotel.name,
      address: hotel.address,
      checkIn,
      checkOut,
      nights,
      guests,
      roomType,
      totalPrice,
      image: hotelImage,
    });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setBookingConfirmed(null);
    setDiscountApplied(false);
    setCouponCode('');
    onClose();
  };

  const externalBookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + (hotel.city || ''))}`;

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title={`Reservation Request: ${hotel.name}`}>
      {bookingConfirmed ? (
        <div className="space-y-5 text-center py-2 animate-fade-in">
          {/* Confirmed Banner */}
          <div className="relative h-32 w-full rounded-2xl overflow-hidden shadow-md">
            <img src={bookingConfirmed.image} alt={bookingConfirmed.hotelName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                Confirmed Stay
              </span>
              <h4 className="font-extrabold text-base leading-tight mt-1">{bookingConfirmed.hotelName}</h4>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Booking Reference ID:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{bookingConfirmed.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Check-In / Out:</span>
              <span className="font-semibold">{bookingConfirmed.checkIn} ➔ {bookingConfirmed.checkOut} ({bookingConfirmed.nights} N)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Room Type & Guests:</span>
              <span className="font-semibold">{bookingConfirmed.roomType} ({bookingConfirmed.guests} Guests)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-black text-sm text-emerald-600 dark:text-emerald-400">
              <span>Total Amount Paid:</span>
              <span>₹{bookingConfirmed.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {selectedTripId && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Logged into your Trip Budget Tracker automatically!</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={externalBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
            >
              Verify Booking.com Live <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Hotel Image & Amenities Preview Header */}
          <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={hotelImage} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {hotel.category || 'Hotel / Lodge'}
                </span>
                <h4 className="font-extrabold text-base leading-tight">{hotel.name}</h4>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400" /> {hotel.address}
                </p>
              </div>
              <span className="text-sm font-black text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-xl backdrop-blur-md">
                ₹{baseRate.toLocaleString()} / N
              </span>
            </div>
          </div>

          {/* Dates & Guests */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Check-In Date *
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Check-Out Date *
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Room & Lodge Category
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Family Cottage">Family Cottage</option>
                <option value="Luxury Safari Tent">Luxury Safari Tent</option>
                <option value="Executive Mountain Suite">Executive Mountain Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Guests Count
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
                min="1"
                max="10"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon (e.g. ADVENTURE10)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              Apply
            </button>
          </div>

          {discountApplied && (
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 10% Discount Applied! Saved ₹{discountAmount.toLocaleString()}
            </div>
          )}

          {/* Sync to Trip Expenses */}
          {trips.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Log Cost to Trip Expenses (Optional)
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Do not log into trip expenses</option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.destination} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Total Breakdown & Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total ({nights} N)
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Room Stay'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default HotelBookingModal;

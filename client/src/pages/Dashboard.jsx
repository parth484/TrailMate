import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import QuickStats from '../components/dashboard/QuickStats';
import UpcomingTripsList from '../components/dashboard/UpcomingTripsList';
import RecentTripsList from '../components/dashboard/RecentTripsList';
import TripFormModal from '../components/trips/TripFormModal';
import useScrollReveal from '../hooks/useScrollReveal';
import TiltCard3D from '../components/common/TiltCard3D';
import Adventure3DCanvas from '../components/3d/Adventure3DCanvas';
import {
  Plus, Compass, Sparkles, Mountain, Waves, Wind, Zap,
  Map, Star, TrendingUp, Globe, Camera, ArrowRight, ChevronDown,
  Navigation, Eye, ShieldCheck, Flame, Hotel,
} from 'lucide-react';

/* ── 3D Feature highlight card with mouse tilt & depth ─────────── */
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <div className={`reveal delay-${delay}`}>
    <TiltCard3D maxRotation={15} scale={1.03} className="h-full">
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full bg-white/70 dark:bg-slate-900/70">
        <div className="translate-z-20 space-y-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-emerald-500/10 transition-transform group-hover:scale-110`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <span>Explore Feature</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </TiltCard3D>
  </div>
);

/* ── 3D Adventure destination spotlight card ──────────────────── */
const SpotlightCard3D = ({ name, location, tag, image, rating, delay }) => (
  <div className={`reveal delay-${delay}`}>
    <TiltCard3D maxRotation={16} scale={1.04} className="h-full">
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-lg h-72 flex flex-col justify-between p-5 group">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between translate-z-20">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow">
            {tag}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {rating}
          </div>
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 space-y-1 text-white translate-z-30">
          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-emerald-400" /> {location}
          </span>
          <h4 className="font-extrabold text-lg leading-tight text-white group-hover:text-emerald-300 transition-colors">
            {name}
          </h4>
        </div>
      </div>
    </TiltCard3D>
  </div>
);

/* ── Adventure destination pill ───────────────────────────────── */
const DestPill = ({ label, emoji, delay }) => (
  <span
    className={`reveal delay-${delay} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 hover:text-emerald-500 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5`}
  >
    {emoji} {label}
  </span>
);

/* ── 3D Animated stat number card ─────────────────────────────── */
const AnimatedStat = ({ value, label, icon: Icon, color, delay }) => {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          let start = 0;
          const end = parseInt(value, 10) || 0;
          const duration = 1400;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setDisplayed(start);
            if (start >= end) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  return (
    <div ref={ref} className={`reveal delay-${delay}`}>
      <TiltCard3D maxRotation={12} scale={1.03}>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl bg-white/70 dark:bg-slate-900/70">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${color} shadow-lg transition-transform group-hover:scale-110`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white translate-z-30">
            {displayed}+
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            {label}
          </div>
        </div>
      </TiltCard3D>
    </div>
  );
};

/* ── Marquee adventure photos strip ──────────────────────────── */
const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format', label: 'Himalayan High Peak' },
  { url: 'https://images.unsplash.com/photo-1508672019048-805479767513?w=400&auto=format', label: 'Bir Billing Flight' },
  { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&auto=format', label: 'Ganges Rafting' },
  { url: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=400&auto=format', label: 'Pawna Lakeside Camp' },
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format', label: 'Taj Palace Luxury' },
  { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&auto=format', label: 'Safari Star Camp' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&auto=format', label: 'Goa Coastal Waters' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format', label: 'Strawberry Chalet' },
];

const PhotoStrip = () => (
  <div className="overflow-hidden relative h-40 w-full rounded-3xl">
    <div className="flex gap-4 animate-marquee w-max">
      {[...PHOTOS, ...PHOTOS].map((p, i) => (
        <div key={i} className="relative h-36 w-52 rounded-2xl overflow-hidden shrink-0 shadow-lg group">
          <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <span className="absolute bottom-2.5 left-3 text-white text-xs font-bold">{p.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: Map,       title: 'Interactive 3D & Maps',  desc: 'Accurate OpenStreetMap geocoding with 3D terrain & live markers for Pune, Delhi, Mumbai.', color: 'bg-emerald-500', delay: '100' },
  { icon: Waves,     title: 'Rafting & Watersports',  desc: 'Grade 3/4 rapids in Kolad Kundalika & Rishikesh, plus Arabian sea scuba diving in Goa.', color: 'bg-sky-500',     delay: '200' },
  { icon: Wind,      title: 'Tandem Paragliding',     desc: 'Soar 8000ft over Dhauladhar mountains in Bir Billing or Western Ghats in Kamshet.',      color: 'bg-violet-500',  delay: '300' },
  { icon: Mountain,  title: 'Sahyadri & Snow Treks',  desc: 'Rajmachi Fort, Sinhagad sunrise, Harishchandragad Konkan Kada & Chadar ice river trek.',   color: 'bg-amber-500',   delay: '400' },
  { icon: Hotel,     title: '50+ Hotels & Villas',    desc: 'Pawna lake safari tents, luxury Airbnb pool villas & 5-star palace suites with photo tours.', color: 'bg-rose-500',    delay: '500' },
  { icon: TrendingUp,title: 'Auto Budget Sync',       desc: 'Calculate nights and room costs automatically into your Trip Expense Tracker with coupons.', color: 'bg-teal-500',    delay: '600' },
];

const SPOTLIGHTS = [
  {
    name: 'Pawna Lakeside Safari Camp',
    location: 'Lonavala / Kamshet (near Pune)',
    tag: 'Trending Stay ⛺',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
    delay: '100',
  },
  {
    name: 'Kundalika River Rafting',
    location: 'Kolad, Raigad (near Pune)',
    tag: 'Extreme Water 🌊',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    delay: '200',
  },
  {
    name: 'The Glasshouse Pool Villa',
    location: 'Koregaon Park, Pune',
    tag: 'Luxury Airbnb 🏡',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    delay: '300',
  },
  {
    name: 'Bir Billing Paragliding Takeoff',
    location: 'Kangra, Himachal Pradesh',
    tag: 'Sky High 🪂',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1508672019048-805479767513?w=800',
    delay: '400',
  },
];

const DESTINATIONS = [
  { label: 'Pune & Sahyadris', emoji: '🏔️' },
  { label: 'Pawna Lake',       emoji: '⛺' },
  { label: 'Kamshet',          emoji: '🌤️' },
  { label: 'Rishikesh',        emoji: '🌊' },
  { label: 'Bir Billing',      emoji: '🪂' },
  { label: 'Ladakh',           emoji: '❄️' },
  { label: 'Manali',           emoji: '🏔️' },
  { label: 'Goa Coast',        emoji: '🏖️' },
  { label: 'Lonavala',         emoji: '🌿' },
  { label: 'Sinhagad Fort',    emoji: '🏯' },
  { label: 'Kolad Rafting',    emoji: '🚣' },
  { label: 'Coorg',            emoji: '☕' },
];

/* ─── Main Dashboard Component ────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const { trips, stats, fetchTrips, fetchStats, createTrip } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Activate scroll reveal observer
  useScrollReveal();

  useEffect(() => {
    fetchTrips();
    fetchStats();
  }, [fetchTrips, fetchStats]);

  const handleCreateTrip = async (tripData) => {
    await createTrip(tripData);
  };

  return (
    <div className="space-y-16 pb-16">

      {/* ══════════════════════════════════════════════════
          3D INTERACTIVE HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative space-y-6">
        {/* Top welcoming headline & controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-slow" />
              Indian Adventure 3D Expedition Mode 🏔️
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Explore India in{' '}
              <span className="shimmer-text">Interactive 3D</span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Welcome back, <strong className="text-emerald-500">{user?.name || 'Explorer'}</strong>! Spin the 3D globe to preview expedition pins across Pune, Rishikesh, Ladakh & Goa, or switch to 3D mountain wireframe mode.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all duration-300 hover:scale-105 animate-border-glow"
            >
              <Plus className="w-5 h-5" /> Plan 3D Trip
            </button>
            <a
              href="/places"
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 shadow-sm"
            >
              <Compass className="w-4 h-4 text-emerald-500" /> 50+ Hotels & Stays
            </a>
          </div>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div className="relative">
          <Adventure3DCanvas />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3D ANIMATED STATS ROW
      ══════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="reveal text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Telemetry & Progress</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">Your Adventure Statistics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatedStat value={stats?.totalTrips    || trips.length || 5}    label="Expeditions"     icon={Globe}      color="bg-emerald-500" delay="100" />
          <AnimatedStat value={stats?.upcomingTrips  || 2}                    label="Upcoming Stays"  icon={Compass}    color="bg-sky-500"     delay="200" />
          <AnimatedStat value={stats?.completedTrips || 3}                    label="Peaks Conquered" icon={Star}       color="bg-amber-500"   delay="300" />
          <AnimatedStat value={stats?.totalExpenses  || 24500}                label="Total ₹ Budget"  icon={TrendingUp} color="bg-violet-500"  delay="400" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3D SPOTLIGHT ADVENTURE CARDS
      ══════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <div className="reveal flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Sahyadris & Western Ghats</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Featured 3D Stays & Expeditions</h2>
          </div>
          <a href="/places" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View All 50+ <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPOTLIGHTS.map((s, idx) => (
            <SpotlightCard3D key={idx} {...s} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          QUICK STATS SUMMARY
      ══════════════════════════════════════════════════ */}
      <section className="reveal">
        <QuickStats stats={stats} />
      </section>

      {/* ══════════════════════════════════════════════════
          SCROLLING PHOTO STRIP
      ══════════════════════════════════════════════════ */}
      <section className="space-y-4 reveal">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-500" /> High-Definition Adventure Gallery
        </h2>
        <PhotoStrip />
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURE HIGHLIGHTS 3D GRID
      ══════════════════════════════════════════════════ */}
      <section id="explore" className="space-y-6">
        <div className="reveal text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Expedition Toolkit</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">Everything You Need for Wild India</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          POPULAR DESTINATION PILLS
      ══════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <div className="reveal text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Top Indian Adventure Destinations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select any region to explore stays and trekking trails</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {DESTINATIONS.map((d, i) => (
            <DestPill key={i} label={d.label} emoji={d.emoji} delay={((i % 6) + 1) * 100} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          UPCOMING & RECENT TRIPS
      ══════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="reveal-left lg:col-span-2 space-y-6">
          <UpcomingTripsList trips={trips} />
        </div>
        <div className="reveal-right space-y-6">
          <RecentTripsList trips={trips} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3D CALL-TO-ACTION BANNER
      ══════════════════════════════════════════════════ */}
      <section className="reveal-scale">
        <TiltCard3D maxRotation={8} scale={1.01}>
          <div className="relative rounded-3xl overflow-hidden glass-panel p-10 md:p-12 border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-2xl">
            <div className="absolute top-0 left-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 space-y-2 translate-z-20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Start Your Journey
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Ready for Your Next{' '}
                <span className="shimmer-text">Indian Expedition?</span>
              </h2>
              <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                Book Pawna lake safari camps, luxury Koregaon Park pool villas, plan Kolad river rafting, and track every rupee in your budget tracker.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 shrink-0 translate-z-30"
            >
              Start Planning Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </TiltCard3D>
      </section>

      {/* Modal */}
      <TripFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTrip}
      />
    </div>
  );
};

export default Dashboard;

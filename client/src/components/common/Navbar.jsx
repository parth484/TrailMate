import React, { useState, useEffect } from 'react';
import { Compass, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getLocalProfile } from '../../utils/profileStorage';

const Navbar = ({ toggleSidebar }) => {
  const [profile, setProfile] = useState(() => getLocalProfile());

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setProfile(event.detail || getLocalProfile());
    };
    window.addEventListener('trailmate-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('trailmate-profile-updated', handleProfileUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 bg-clip-text text-transparent">
              Wanderlust Adventure India
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              Expedition 🏔️
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/50"
            />
            <span className="hidden md:inline-block font-medium text-sm text-slate-700 dark:text-slate-200">
              {profile.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

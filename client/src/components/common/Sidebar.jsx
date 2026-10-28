import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, CalendarRange, Wallet, Compass as DiscoverIcon, User, X } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Trips', path: '/trips', icon: Compass },
    { label: 'Itinerary', path: '/itinerary', icon: CalendarRange },
    { label: 'Budget Tracker', path: '/budget', icon: Wallet },
    { label: 'Explore Places', path: '/places', icon: DiscoverIcon },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 glass-panel border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between lg:hidden mb-6 px-2">
            <span className="font-bold text-lg text-slate-800 dark:text-slate-100">Navigation</span>
            <button onClick={closeSidebar} className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-sky-500 dark:hover:text-sky-400'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Indian Adventure Motivation Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/20 text-center">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Indian Expeditions 🏔️
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            "Live with no excuses and travel with no regrets across the Himalayas."
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

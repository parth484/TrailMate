import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'sky', subtitle }) => {
  const colorClasses = {
    sky: 'from-sky-500/20 to-blue-500/10 text-sky-500 border-sky-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/20',
    purple: 'from-purple-500/20 to-pink-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border transition-all hover:scale-[1.02] duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color] || colorClasses.sky}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';
import StatCard from '../common/StatCard';
import { Compass, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const QuickStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Trips"
        value={stats.totalTrips || 0}
        icon={Compass}
        color="sky"
        subtitle="Planned adventures"
      />
      <StatCard
        title="Total Budget"
        value={`$${(stats.totalBudget || 0).toLocaleString()}`}
        icon={DollarSign}
        color="emerald"
        subtitle={`Spent: $${(stats.totalSpent || 0).toLocaleString()}`}
      />
      <StatCard
        title="Upcoming Trips"
        value={stats.upcomingTripsCount || 0}
        icon={Calendar}
        color="amber"
        subtitle="Ready to explore"
      />
      <StatCard
        title="Completed"
        value={stats.completedTripsCount || 0}
        icon={CheckCircle}
        color="purple"
        subtitle="Memories created"
      />
    </div>
  );
};

export default QuickStats;

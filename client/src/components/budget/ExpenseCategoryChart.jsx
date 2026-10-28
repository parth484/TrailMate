import React from 'react';
import { PieChart } from 'lucide-react';

const ExpenseCategoryChart = ({ expenses = [] }) => {
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const categoryColors = {
    Accommodation: '#0ea5e9', // Sky blue
    Food: '#f59e0b',          // Amber
    Transport: '#6366f1',     // Indigo
    Activities: '#10b981',    // Emerald
    Shopping: '#a855f7',      // Purple
    Other: '#64748b',         // Slate
  };

  const categories = Object.keys(categoryTotals);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-indigo-500" />
        Expense Breakdown
      </h3>

      {totalSpent === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          No expenses recorded to build chart breakdown.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const amount = categoryTotals[cat];
            const percent = Math.round((amount / totalSpent) * 100);
            const color = categoryColors[cat] || '#64748b';

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {cat}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    ${amount.toLocaleString()} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoryChart;

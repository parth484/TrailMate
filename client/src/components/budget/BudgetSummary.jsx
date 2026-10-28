import React from 'react';
import { DollarSign, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

const BudgetSummary = ({ budget = 0, totalSpent = 0, remaining = 0 }) => {
  const percentageSpent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const isOverBudget = totalSpent > budget;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-emerald-500" />
        Budget Overview
      </h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Budget
          </span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 block">
            ${budget.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Spent
          </span>
          <span className="text-lg font-extrabold text-rose-500 mt-0.5 block">
            ${totalSpent.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Remaining
          </span>
          <span className={`text-lg font-extrabold mt-0.5 block ${isOverBudget ? 'text-rose-600' : 'text-emerald-500'}`}>
            ${remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Spending Progress</span>
          <span className={isOverBudget ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
            {percentageSpent}% spent
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : percentageSpent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {isOverBudget && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Warning: Total expenses exceed allocated trip budget!</span>
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;

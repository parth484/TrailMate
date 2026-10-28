import React from 'react';
import { Trash2, Calendar, Tag, FileText } from 'lucide-react';

const ExpenseList = ({ expenses = [], onDelete }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Transactions</h3>

      {expenses.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
          No expenses logged yet. Add your first expense above.
        </p>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/50 transition-all duration-200"
            >
              <div className="space-y-0.5">
                <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {exp.title}
                </h5>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                    {exp.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  {exp.notes && (
                    <span className="italic text-slate-400 max-w-[150px] truncate">
                      - {exp.notes}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-base text-rose-500">
                  -${Number(exp.amount).toLocaleString()}
                </span>
                <button
                  onClick={() => onDelete(exp._id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete Expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { useFinance } from '../../../state/financeContext';

const FinanceOverview: React.FC = () => {
  const { ledgerTransactions } = useFinance();

  const totalIncome = ledgerTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = ledgerTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const transactionCount = ledgerTransactions.length;

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₦${totalIncome.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: '+12% vs last month',
      trendUp: true
    },
    { 
      label: 'Total Expenses', 
      value: `₦${totalExpense.toLocaleString()}`, 
      icon: TrendingDown, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      trend: '+5% vs last month',
      trendUp: false
    },
    { 
      label: 'Net Income', 
      value: `₦${netIncome.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      trend: netIncome >= 0 ? 'Profitable' : 'Deficit',
      trendUp: netIncome >= 0
    },
    { 
      label: 'Transactions', 
      value: transactionCount.toString(), 
      icon: Activity, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'Active activity',
      trendUp: true
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Financial Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <PieChart className="w-7 h-7" />
              Finance Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Comprehensive view of school income, expenses, and financial health.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Current Balance</p>
              <p className="text-2xl font-bold">₦{netIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          let gradient = 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500';
          if (stat.label.includes('Expenses')) gradient = 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500';
          else if (stat.label.includes('Net')) gradient = 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500';
          else if (stat.label.includes('Transactions')) gradient = 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500';

          return (
            <div key={index} className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg transition-all duration-300 hover:shadow-${stat.color.split('-')[1]}-500/10`}>
              <div className={`absolute inset-x-0 top-0 h-1 ${gradient}`} />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Ledger Activity</h3>
        <div className="space-y-4">
          {ledgerTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  tx.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {tx.type === 'Income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500 font-medium">{new Date(tx.date).toLocaleDateString()} • {tx.accountName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'Income' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </p>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {tx.paymentMethod}
                </span>
              </div>
            </div>
          ))}
          {ledgerTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-4">No transactions recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
import React from 'react';
import { CreditCard, Clock, FileText, TrendingUp } from 'lucide-react';

interface AdminFinanceSummaryProps {
  data: any;
}

const AdminFinanceSummary: React.FC<AdminFinanceSummaryProps> = ({ data }) => {
  const stats = [
    { title: 'Total Expenses', value: `₦${(data.totalExpenses / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'bg-rose-500' },
    { title: 'Payroll Disbursed', value: `₦${(data.payrollDisbursed / 1000000).toFixed(1)}M`, icon: CreditCard, color: 'bg-emerald-500' },
    { title: 'Pending Payroll Runs', value: data.pendingPayroll, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Administrative Accounting</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 opacity-10 rounded-full ${stat.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-opacity-10 ${stat.color.replace('bg-', 'text-').replace('500', '600')} ${stat.color.replace('bg-', 'bg-').replace('500', '50')}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Recent Ledger Entries</h3>
      <div className="space-y-4">
        {data.recentLedgerEntries.map((entry: any) => (
          <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                entry.type === 'Expense' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{entry.description}</p>
                <p className="text-xs text-gray-500 font-medium">{entry.date}</p>
              </div>
            </div>
            <div className={`text-right font-black ${entry.type === 'Expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {entry.type === 'Expense' ? '-' : '+'}₦{entry.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFinanceSummary;

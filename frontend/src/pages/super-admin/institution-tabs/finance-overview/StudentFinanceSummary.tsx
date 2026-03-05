import React from 'react';
import { DollarSign, FileText, CreditCard, Clock, PieChart } from 'lucide-react';

interface StudentFinanceSummaryProps {
  data: any;
}

const StudentFinanceSummary: React.FC<StudentFinanceSummaryProps> = ({ data }) => {
  const stats = [
    { title: 'Total Revenue', value: `₦${(data.totalRevenue / 1000000).toFixed(1)}M`, change: '+12%', isPositive: true, color: 'bg-emerald-500', icon: DollarSign },
    { title: 'Pending Invoices', value: `₦${(data.pendingInvoices / 1000000).toFixed(1)}M`, change: '-5%', isPositive: false, color: 'bg-amber-500', icon: Clock },
    { title: 'Total Invoices', value: data.totalInvoices, change: '+8%', isPositive: true, color: 'bg-blue-500', icon: FileText },
    { title: 'Collection Rate', value: `${data.collectionRate}%`, change: '+2%', isPositive: true, color: 'bg-indigo-500', icon: PieChart },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Student Accounting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 opacity-10 rounded-full ${stat.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-opacity-10 ${stat.color.replace('bg-', 'text-').replace('500', '600')} ${stat.color.replace('bg-', 'bg-').replace('500', '50')}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {data.recentTransactions.map((tx: any) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                tx.type === 'Payment' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {tx.type === 'Payment' ? <CreditCard size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{tx.student}</p>
                <p className="text-xs text-gray-500 font-medium">{tx.type} • {tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-900 dark:text-white">₦{tx.amount.toLocaleString()}</p>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${
                tx.status === 'Success' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFinanceSummary;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CreditCard, 
  Clock, 
  ArrowRight,
  PieChart
} from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = [
    { title: 'Total Revenue', value: '₦45.2M', change: '+12%', isPositive: true, color: 'bg-emerald-500', icon: DollarSign },
    { title: 'Pending Invoices', value: '₦8.5M', change: '-5%', isPositive: false, color: 'bg-amber-500', icon: Clock },
    { title: 'Expenses (YTD)', value: '₦12.1M', change: '+8%', isPositive: false, color: 'bg-rose-500', icon: TrendingDown },
    { title: 'Net Income', value: '₦33.1M', change: '+15%', isPositive: true, color: 'bg-blue-500', icon: TrendingUp },
  ];

  const recentTransactions = [
    { id: 1, type: 'Payment', student: 'John Doe', amount: '₦150,000', date: '2024-03-15', status: 'Success' },
    { id: 2, type: 'Invoice', student: 'Jane Smith', amount: '₦45,000', date: '2024-03-14', status: 'Pending' },
    { id: 3, type: 'Payment', student: 'Michael Brown', amount: '₦200,000', date: '2024-03-14', status: 'Success' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            Student Finance Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Overview of student fees, invoices, and collections.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/school-admin/finance/student-accounting/invoices')}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm"
          >
            View Invoices
          </button>
          <button 
            onClick={() => navigate('/school-admin/finance/student-accounting/payments')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
          >
            Record Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/school-admin/finance/student-accounting/payments')}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-black flex items-center gap-1 uppercase tracking-wide"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
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
                  <p className="font-black text-gray-900 dark:text-white">{tx.amount}</p>
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

        {/* Quick Actions / Summary */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Finance Overview</h3>
            <p className="text-indigo-100 mb-8 max-w-md">
              Monitor key financial metrics and student payment statuses. Ensure all invoices are generated for the new term.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-1">Collection Rate</p>
                <p className="text-3xl font-black">85%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-1">Outstanding</p>
                <p className="text-3xl font-black">15%</p>
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-colors shadow-lg">
              Generate Financial Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

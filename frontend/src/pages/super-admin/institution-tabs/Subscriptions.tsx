import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  CreditCard, 
  Download, 
  Users, 
  HardDrive, 
  Activity,
  Gem,
  Bell
} from 'lucide-react';

const Subscriptions: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const billingHistory = [
    {
      id: 'INV-2023-001',
      date: 'Oct 12, 2023',
      description: 'Enterprise Yearly Subscription',
      amount: '$12,000.00',
      status: 'Paid',
      paymentMethod: 'Mastercard ending in 4242',
      invoice: '#'
    },
    {
      id: 'INV-2023-002',
      date: 'Sep 15, 2023',
      description: 'Storage Add-on (500GB)',
      amount: '$150.00',
      status: 'Paid',
      paymentMethod: 'Mastercard ending in 4242',
      invoice: '#'
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-none">
      {loading ? (
        <>
          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                  <div className="flex items-center gap-3 pt-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-px" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="mb-2 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <div className="flex items-baseline gap-1">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                <Skeleton className="h-1.5 w-full rounded-full mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="p-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-32 hidden md:block" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
      {/* Enterprise Plan Card */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
              <Gem className="text-blue-600 dark:text-blue-500" size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enterprise Yearly</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Comprehensive ERP access for large institutions.</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Renews on <span className="font-bold text-gray-900 dark:text-white">Oct 12, 2024</span></span>
                <span className="h-4 w-px bg-gray-300 dark:bg-gray-700"></span>
                <span className="text-gray-500 dark:text-gray-400"><span className="font-bold text-gray-900 dark:text-white">$12,000.00</span> / year</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
              <Bell size={16} />
              Send a Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Users */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Usage</span>
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Users</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">2,450</span>
              <span className="text-sm font-medium text-gray-400">/ 5,000</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '49%' }}></div>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">49% of license utilized</p>
        </div>

        {/* Storage */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <HardDrive size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Storage</span>
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Storage Used</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">450 GB</span>
              <span className="text-sm font-medium text-gray-400">/ 1 TB</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Ample space remaining</p>
        </div>

        {/* API Calls */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">API Calls</span>
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly API Requests</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">1.2M</span>
              <span className="text-sm font-medium text-gray-400">/ 2M</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Resets in 12 days</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Payment History</h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Download All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {billingHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CreditCard size={16} className="text-gray-400" />
                      {item.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-1.5 w-fit bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a2438]/50 text-center">
          <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            View All Transactions
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Subscriptions;

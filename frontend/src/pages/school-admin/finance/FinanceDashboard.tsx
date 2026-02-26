import React from 'react';
import { DollarSign, TrendingUp, CreditCard, PieChart, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useFinance } from '../../../state/financeContext';

const FinanceDashboard: React.FC = () => {
  const { invoices, payments } = useFinance();

  // --- Calculations ---
  
  const totalRevenue = payments
    .filter(p => p.status === 'Posted')
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const outstanding = totalInvoiced - totalRevenue;

  const paidInvoicesCount = invoices.filter(inv => inv.status === 'Paid').length;
  const unpaidInvoicesCount = invoices.filter(inv => inv.status === 'Unpaid').length;

  const recentTransactions = payments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-blue-600" />
            Finance Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Financial health at a glance for the current session
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
            Session: 2024/2025
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue Collected</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ₦{totalRevenue.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <ArrowUpRight size={14} />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding Receivables</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ₦{outstanding.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                <ArrowDownRight size={14} />
                <span>{Math.round((outstanding / totalInvoiced) * 100)}% of total invoiced</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoices Generated</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {invoices.length}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{paidInvoicesCount} Paid</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{unpaidInvoicesCount} Unpaid</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <CreditCard size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{tx.transactionReference}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{tx.paymentMethod}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₦{tx.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        tx.status === 'Posted' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No recent transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Distribution (Placeholder for Chart) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
            <PieChart size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Visual breakdown of revenue by fee type would appear here using a chart library.
          </p>
          <div className="mt-6 w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Tuition</span>
              <span className="font-bold text-gray-900 dark:text-white">75%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Acceptance</span>
              <span className="font-bold text-gray-900 dark:text-white">15%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Other</span>
              <span className="font-bold text-gray-900 dark:text-white">10%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

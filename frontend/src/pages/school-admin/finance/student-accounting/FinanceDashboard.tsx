import React from 'react';
import { DollarSign, Users, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { useFinance } from '../../../../state/financeContext';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard: React.FC = () => {
  const { invoices, payments, feeStructures } = useFinance();
  const navigate = useNavigate();

  // Calculate stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = payments
    .filter(p => p.status === 'Posted')
    .reduce((sum, p) => sum + p.amountPaid, 0);
  const outstanding = totalInvoiced - totalCollected;
  
  const paymentRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const stats = [
    { 
      title: 'Total Invoiced', 
      value: `₦${totalInvoiced.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-blue-500',
      trend: '+12% from last session'
    },
    { 
      title: 'Total Collected', 
      value: `₦${totalCollected.toLocaleString()}`, 
      icon: CreditCard, 
      color: 'bg-green-500',
      trend: `${paymentRate}% collection rate`
    },
    { 
      title: 'Outstanding', 
      value: `₦${outstanding.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      trend: 'Needs attention'
    },
    { 
      title: 'Active Fees', 
      value: feeStructures.length.toString(), 
      icon: Users, 
      color: 'bg-purple-500',
      trend: 'Across all programs'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Finance Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of student fees, invoices, and collections.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/school-admin/finance/student-accounting/invoices')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium text-sm"
          >
            View Invoices
          </button>
          <button 
            onClick={() => navigate('/school-admin/finance/student-accounting/payments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
          >
            Record Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
                <stat.icon size={20} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/school-admin/finance/student-accounting/payments')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {payments.slice(0, 5).map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{payment.transactionReference}</p>
                    <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">₦{payment.amountPaid.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="text-center py-8 text-gray-500">No recent transactions</div>
            )}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Invoices</h3>
            <button 
              onClick={() => navigate('/school-admin/finance/student-accounting/invoices')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {invoices.filter(i => i.status !== 'Paid').slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.studentId}</p>
                  <p className="text-xs text-gray-500">ID: {invoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">₦{invoice.totalAmount.toLocaleString()}</p>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.filter(i => i.status !== 'Paid').length === 0 && (
              <div className="text-center py-8 text-gray-500">No pending invoices</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

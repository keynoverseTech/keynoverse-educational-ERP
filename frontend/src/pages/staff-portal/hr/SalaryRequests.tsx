import React, { useState } from 'react';
import { TrendingUp, Plus, AlertCircle, Clock } from 'lucide-react';

const SalaryRequests = () => {
  const [activeTab, setActiveTab] = useState<'advance' | 'adjustment'>('advance');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  // Mock Data
  const requests = [
    { id: 1, type: 'Advance', amount: 50000, date: '2025-10-10', status: 'Pending', reason: 'Emergency medical bills' },
    { id: 2, type: 'Adjustment', amount: 20000, date: '2025-08-15', status: 'Rejected', reason: 'Completed PhD program' },
    { id: 3, type: 'Advance', amount: 30000, date: '2025-05-20', status: 'Approved', reason: 'Car repair' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${activeTab === 'advance' ? 'Salary advance' : 'Salary adjustment'} request submitted successfully!`);
    setAmount('');
    setReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Pending': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'Rejected': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Salary Requests
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Request salary advances or adjustments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('advance')}
                  className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'advance'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Salary Advance
                </button>
                <button
                  onClick={() => setActiveTab('adjustment')}
                  className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'adjustment'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Salary Adjustment
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                {activeTab === 'advance' ? (
                  <p>
                    Salary advances are typically deducted from your next month's salary. 
                    Maximum allowed advance is 50% of your basic salary.
                  </p>
                ) : (
                  <p>
                    Salary adjustments are subject to HR review and approval based on performance, 
                    qualification upgrades, or promotion policies.
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {activeTab === 'advance' ? 'Advance Amount (₦)' : 'Expected Increase Amount (₦)'}
                  </label>
                  <input
                    required
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Justification</label>
                  <textarea
                    required
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Please explain why you are making this request..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Request History */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-gray-400" /> History
            </h3>
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{req.type}</h4>
                      <p className="text-xs text-gray-500">{req.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ₦{req.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{req.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryRequests;

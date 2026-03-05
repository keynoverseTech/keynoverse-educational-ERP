import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    handoverTo: ''
  });

  // Mock Data
  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Study Leave', 'Maternity Leave'];
  const leaveHistory = [
    { id: 1, type: 'Casual Leave', start: '2025-09-10', end: '2025-09-12', days: 3, status: 'Approved' },
    { id: 2, type: 'Sick Leave', start: '2025-08-05', end: '2025-08-06', days: 2, status: 'Approved' },
    { id: 3, type: 'Annual Leave', start: '2025-12-20', end: '2026-01-05', days: 15, status: 'Pending' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Leave request submitted successfully!');
    setFormData({ type: '', startDate: '', endDate: '', reason: '', handoverTo: '' });
    setActiveTab('history');
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
          <Calendar className="w-6 h-6 text-purple-600" />
          Leave Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Request and track your leave applications.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'request'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              History
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'request' ? (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Type</option>
                    {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Handover To (Optional)</label>
                  <input
                    type="text"
                    value={formData.handoverTo}
                    onChange={(e) => setFormData({...formData, handoverTo: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Staff Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Please provide details..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Submit Request
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {leaveHistory.map(leave => (
                <div key={leave.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{leave.type}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {leave.start} to {leave.end} • {leave.days} days
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;

import React, { useState } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';

const TransportSubscriptions: React.FC = () => {
  const { subscriptions } = useTransport();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubs = subscriptions.filter(sub => 
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Subscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor student bus passes and payments.</p>
        </div>
      </div>

      <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search subscriptions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Student</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Route</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Expiry Date</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-6">
                  <div>
                     <p className="font-medium text-gray-900 dark:text-white">{sub.studentName}</p>
                     <p className="text-sm text-gray-500">{sub.studentId}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{sub.routeName}</td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{sub.expiryDate}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'Active' ? 'bg-green-100 text-green-700' :
                    sub.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-blue-600">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSubs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No subscriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportSubscriptions;

import React from 'react';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import type { LeaveRequestSummary } from './types';

interface LeaveRequestsProps {
  requests: LeaveRequestSummary[];
}

const LeaveRequests: React.FC<LeaveRequestsProps> = ({ requests }) => {
  return (
    <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Leave Requests</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
          <Filter size={16} /> Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Staff Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Leave Type</th>
              <th className="px-6 py-3 font-medium text-gray-500">Duration</th>
              <th className="px-6 py-3 font-medium text-gray-500">Date Requested</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{req.staffName}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{req.type}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{req.duration}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(req.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status === 'Approved' && <CheckCircle size={12} />}
                    {req.status === 'Rejected' && <XCircle size={12} />}
                    {req.status === 'Pending' && <Clock size={12} />}
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;

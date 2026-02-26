import React from 'react';
import { CheckCircle, Clock, FileText, User } from 'lucide-react';
import { useHR, type LeaveStatus } from '../../../state/hrAccessControl';

const LeaveApprovals: React.FC = () => {
  const { leaveRequests, setLeaveRequests, staff, leaveTypes } = useHR();
  
  // In a real app, we would check the logged-in user's permission.
  // Since we are simulating, let's assume we are viewing this page because we are allowed.
  // However, we can use a mock staff ID to demonstrate the permission check if needed.
  // For now, we'll just show the list.

  const getStaffName = (id: string) => {
    const s = staff.find(st => st.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown Staff';
  };

  const getLeaveTypeName = (id: string) => {
    const t = leaveTypes.find(lt => lt.id === id);
    return t ? t.name : 'Unknown Type';
  };

  const handleAction = (id: string, status: LeaveStatus) => {
    const comment = prompt(`Add a comment for ${status === 'Approved' ? 'approval' : 'rejection'}:`);
    if (comment === null) return; // Cancelled

    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status, comment } : req
    ));
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const historyRequests = leaveRequests.filter(req => req.status !== 'Pending');

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-7 h-7 text-blue-600" />
          Leave Approvals
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review and act on staff leave applications
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="text-orange-500" size={20} />
          Pending Requests ({pendingRequests.length})
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No pending requests to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    <span className="font-bold text-gray-900 dark:text-white">{getStaffName(req.staffId)}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {getLeaveTypeName(req.leaveTypeId)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Date:</span> {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 italic">
                    "{req.reason}"
                  </div>
                  {req.attachment && (
                    <div className="text-xs text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
                      <FileText size={12} /> View Attachment
                    </div>
                  )}
                </div>
                
                <div className="flex flex-row md:flex-col justify-center gap-2">
                  <button 
                    onClick={() => handleAction(req.id, 'Approved')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'Rejected')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request History</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Staff</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Duration</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {historyRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{getStaffName(req.staffId)}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{getLeaveTypeName(req.leaveTypeId)}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 italic max-w-xs truncate">{req.comment || '-'}</td>
                  </tr>
                ))}
                {historyRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No history available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovals;

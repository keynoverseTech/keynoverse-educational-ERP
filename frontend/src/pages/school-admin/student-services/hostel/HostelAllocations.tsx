import React, { useState } from 'react';
import { Search, Filter, MoreVertical, FileText, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useHostel } from "../../../../state/hostelContext";

const HostelAllocations: React.FC = () => {
  const { requests, autoAllocate, updateRequestStatus } = useHostel();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAutoAllocate = () => {
    const result = autoAllocate();
    alert(`Auto-allocation complete!\nSuccessfully allocated: ${result.allocated}\nFailed (No matching room): ${result.failed}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Allocated': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Allocations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage student hostel requests and room assignments.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
            <FileText size={18} />
            Export List
          </button>
          <button 
            onClick={handleAutoAllocate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Zap size={18} />
            Auto-Allocate
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by student name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Allocated">Allocated</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="p-2 border rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Student Info</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Programme</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Requested</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{req.studentName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{req.studentId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900 dark:text-white">{req.programme}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Level {req.level}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                    <div className="flex flex-col">
                      <span>{req.requestedType}</span>
                      <span className="text-xs text-gray-400">{req.gender}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">{req.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    {req.assignedRoom && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">Room: {req.assignedRoom}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => updateRequestStatus(req.id, 'Rejected')}
                            title="Reject"
                            className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                             // For manual allocation, we'd open a modal. For now let's just use auto-allocate or reject.
                             // But let's add a placeholder button for manual.
                             title="Manual Allocate (Coming Soon)"
                             className="p-1 hover:bg-blue-100 text-gray-400 hover:text-blue-600 rounded"
                          >
                             <CheckCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                 <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostelAllocations;

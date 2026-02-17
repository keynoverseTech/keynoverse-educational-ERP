import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';

interface RegistrationRequest {
  id: string;
  studentName: string;
  matricNumber: string;
  level: number;
  semester: string;
  totalUnits: number;
  courses: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

const RegistrationApprovals: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([
    {
      id: '1',
      studentName: 'John Doe',
      matricNumber: 'SCI/2024/001',
      level: 100,
      semester: '1',
      totalUnits: 24,
      courses: 8,
      status: 'Pending',
      date: '2025-02-10',
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      matricNumber: 'SCI/2024/002',
      level: 100,
      semester: '1',
      totalUnits: 22,
      courses: 7,
      status: 'Pending',
      date: '2025-02-11',
    },
     {
      id: '3',
      studentName: 'Alice Johnson',
      matricNumber: 'SCI/2024/003',
      level: 200,
      semester: '1',
      totalUnits: 18,
      courses: 6,
      status: 'Approved',
      date: '2025-02-09',
    },
  ]);

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' } : req
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Approvals</h1>
          <p className="text-gray-500 dark:text-gray-400">Review and approve student course registrations</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search student..."
              className="pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm w-64"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Level</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Units</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white">{req.studentName}</div>
                    <div className="text-xs text-gray-500">{req.matricNumber}</div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {req.level}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {req.totalUnits} Units ({req.courses} Courses)
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {req.date}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {req.status === 'Approved' ? <CheckCircle size={14} /> : 
                       req.status === 'Rejected' ? <XCircle size={14} /> : null}
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Details">
                      <Eye size={18} />
                    </button>
                    {req.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(req.id, 'Approve')}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'Reject')}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationApprovals;

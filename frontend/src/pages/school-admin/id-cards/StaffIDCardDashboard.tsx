import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Printer, 
  RefreshCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  MoreVertical,
  Download
} from 'lucide-react';

interface IDCardRequest {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Pending' | 'Issued' | 'Expired' | 'Reprint Requested';
  issueDate?: string;
  expiryDate?: string;
  avatar: string;
}

import IssueIDCardModal from './components/IssueIDCardModal';

const StaffIDCardDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'issued'>('overview');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  
  // Mock Data
  const requests: IDCardRequest[] = [
    { id: 'STF/2024/001', name: 'Dr. Sarah Wilson', role: 'Senior Lecturer', department: 'Computer Science', status: 'Issued', issueDate: '2024-01-15', expiryDate: '2025-12-31', avatar: 'SW' },
    { id: 'STF/2024/005', name: 'Prof. James Miller', role: 'HOD', department: 'Physics', status: 'Pending', avatar: 'JM' },
    { id: 'STF/2023/042', name: 'Mrs. Emily Clark', role: 'Admin Officer', department: 'Registry', status: 'Reprint Requested', issueDate: '2023-05-10', avatar: 'EC' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="text-blue-600" />
            Staff ID Cards Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage issuance, reprints, and templates for staff identification.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Printer size={18} /> Batch Print
          </button>
          <button 
            onClick={() => setIsIssueModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <User size={18} /> Issue New Card
          </button>
        </div>
      </div>

      <IssueIDCardModal 
        type="Staff"
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssue={(data) => console.log('Issued:', data)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Issued" value="142" icon={CheckCircle} color="text-green-600" bg="bg-green-100 dark:bg-green-900/20" />
        <StatCard title="Pending Approval" value="8" icon={Clock} color="text-orange-600" bg="bg-orange-100 dark:bg-orange-900/20" />
        <StatCard title="Reprint Requests" value="3" icon={RefreshCcw} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-900/20" />
        <StatCard title="Expired / Lost" value="5" icon={AlertTriangle} color="text-red-600" bg="bg-red-100 dark:bg-red-900/20" />
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit">
            {['overview', 'pending', 'issued'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              <Filter size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Staff Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {req.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{req.name}</h4>
                        <p className="text-xs text-gray-500">{req.id} • {req.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {req.department}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'Issued' ? 'bg-green-100 text-green-700' :
                      req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      req.status === 'Reprint Requested' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.issueDate ? (
                      <div className="text-xs text-gray-500">
                        <p><span className="font-bold">Issued:</span> {req.issueDate}</p>
                        <p><span className="font-bold">Expires:</span> {req.expiryDate}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not issued yet</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === 'Issued' && (
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Preview/Download">
                          <Download size={18} />
                        </button>
                      )}
                      {req.status === 'Pending' && (
                        <button className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">
                          Approve
                        </button>
                      )}
                      {req.status === 'Reprint Requested' && (
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                          Process Reprint
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                    </div>
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

export default StaffIDCardDashboard;
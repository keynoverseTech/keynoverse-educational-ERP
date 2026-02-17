import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Search, 
  Filter,
  Eye,
  Upload,
  Plus,
  Calendar
} from 'lucide-react';

interface Application {
  id: string;
  name: string;
  applicationNo: string;
  utmeScore: number;
  programme: string;
  cutoff: number;
  status: 'Pending' | 'Eligible' | 'Admitted' | 'Rejected';
  mode: 'UTME' | 'Direct Entry';
  session: string;
}

const mockApplications: Application[] = [
  { id: '1', name: 'John Doe', applicationNo: '2024987654', utmeScore: 245, programme: 'Computer Science', cutoff: 220, status: 'Eligible', mode: 'UTME', session: '2024/2025' },
  { id: '2', name: 'Jane Smith', applicationNo: '2024123456', utmeScore: 180, programme: 'Accounting', cutoff: 200, status: 'Pending', mode: 'UTME', session: '2024/2025' },
  { id: '3', name: 'Michael Brown', applicationNo: '2024567890', utmeScore: 280, programme: 'Medicine', cutoff: 260, status: 'Admitted', mode: 'UTME', session: '2024/2025' },
  { id: '4', name: 'Sarah Wilson', applicationNo: '2024234567', utmeScore: 150, programme: 'Mass Communication', cutoff: 180, status: 'Rejected', mode: 'UTME', session: '2024/2025' },
  { id: '5', name: 'David Lee', applicationNo: 'DE2024001', utmeScore: 0, programme: 'Computer Engineering', cutoff: 0, status: 'Pending', mode: 'Direct Entry', session: '2024/2025' },
];

const AdmissionsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = mockApplications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.applicationNo.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: mockApplications.length,
    eligible: mockApplications.filter(a => a.status === 'Eligible').length,
    pending: mockApplications.filter(a => a.status === 'Pending').length,
    admitted: mockApplications.filter(a => a.status === 'Admitted').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Admitted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Eligible': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admissions Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and process incoming applications</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/school-admin/admissions/intake')}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Calendar size={18} className="mr-2" />
            Manage Intake
          </button>
          <button 
            onClick={() => navigate('/school-admin/admissions/imports')}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Batch Import
          </button>
          <button 
            onClick={() => navigate('/school-admin/admissions/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            New Application
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setFilterStatus('All')} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>
        <div onClick={() => setFilterStatus('Eligible')} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Eligible</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.eligible}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>
        <div onClick={() => setFilterStatus('Pending')} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.pending}</h3>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
          </div>
        </div>
        <div onClick={() => setFilterStatus('Admitted')} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admitted</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.admitted}</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <UserCheck className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>2024/2025 Session</option>
            <option>2023/2024 Session</option>
          </select>
          <select className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Programmes</option>
            <option>Computer Science</option>
            <option>Medicine</option>
            <option>Accounting</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Eligible">Eligible</option>
            <option value="Admitted">Admitted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Applicant Name</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Application No</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Score</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Cut-Off</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{app.applicationNo}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{app.utmeScore}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{app.programme}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{app.cutoff}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/school-admin/admissions/profile/${app.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-gray-500">No applications found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Simple Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredApplications.length} of {mockApplications.length} results</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsDashboard;
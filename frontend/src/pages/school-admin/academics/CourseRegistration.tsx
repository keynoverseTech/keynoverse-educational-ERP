import { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Eye,
  FileText
} from 'lucide-react';

// --- Interfaces ---

interface StudentRegistration {
  id: string;
  studentName: string;
  matricNumber: string;
  programme: string;
  level: number;
  totalUnits: number;
  status: 'approved' | 'pending' | 'rejected' | 'not_registered';
  submissionDate?: string;
}

// --- Mock Data ---

const mockRegistrations: StudentRegistration[] = [
  { id: '1', studentName: 'John Doe', matricNumber: 'SCI/2024/001', programme: 'Computer Science', level: 100, totalUnits: 24, status: 'approved', submissionDate: '2024-09-15' },
  { id: '2', studentName: 'Jane Smith', matricNumber: 'SCI/2024/002', programme: 'Computer Science', level: 100, totalUnits: 22, status: 'pending', submissionDate: '2024-09-16' },
  { id: '3', studentName: 'Michael Brown', matricNumber: 'ENG/2023/045', programme: 'Electrical Engineering', level: 200, totalUnits: 18, status: 'rejected', submissionDate: '2024-09-14' },
  { id: '4', studentName: 'Sarah Wilson', matricNumber: 'SCI/2021/112', programme: 'Microbiology', level: 400, totalUnits: 0, status: 'not_registered' },
  { id: '5', studentName: 'David Lee', matricNumber: 'ENG/2024/008', programme: 'Mechanical Engineering', level: 100, totalUnits: 24, status: 'approved', submissionDate: '2024-09-10' },
];

export default function CourseRegistration() {
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Derived Statistics
  const stats = useMemo(() => {
    return {
      total: mockRegistrations.length,
      approved: mockRegistrations.filter(r => r.status === 'approved').length,
      pending: mockRegistrations.filter(r => r.status === 'pending').length,
      notRegistered: mockRegistrations.filter(r => r.status === 'not_registered').length,
    };
  }, []);

  // Filtered Data
  const filteredData = useMemo(() => {
    return mockRegistrations.filter(item => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Registration</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage student course registrations for {selectedSession}</p>
        </div>
        <div className="flex gap-2">
           <select 
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option>2024/2025</option>
            <option>2023/2024</option>
          </select>
          <select 
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="1">First Semester</option>
            <option value="2">Second Semester</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 text-sm mb-1">Total Students</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-green-600 text-sm mb-1">Approved</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-yellow-600 text-sm mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 text-sm mb-1">Not Registered</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.notRegistered}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or matric no..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="not_registered">Not Registered</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Programme</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Level</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Units</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map(reg => (
                <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white">{reg.studentName}</div>
                    <div className="text-xs text-gray-500">{reg.matricNumber}</div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {reg.programme}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {reg.level}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {reg.totalUnits}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(reg.status)}`}>
                      {getStatusIcon(reg.status)}
                      <span className="capitalize">{reg.status.replace('_', ' ')}</span>
                    </span>
                    {reg.submissionDate && (
                      <div className="text-xs text-gray-400 mt-1">Submitted: {reg.submissionDate}</div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Details">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No registration records found.
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  BookOpen,
  Users,
  AlertCircle,
  ChevronDown,
  Calendar,
  Settings
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
  avatarUrl?: string;
}

// --- Mock Data ---

const mockRegistrations: StudentRegistration[] = [
  { id: '1', studentName: 'John Doe', matricNumber: 'SCI/2024/001', programme: 'Computer Science', level: 100, totalUnits: 24, status: 'approved', submissionDate: '2024-09-15' },
  { id: '2', studentName: 'Jane Smith', matricNumber: 'SCI/2024/002', programme: 'Computer Science', level: 100, totalUnits: 22, status: 'pending', submissionDate: '2024-09-16' },
  { id: '3', studentName: 'Michael Brown', matricNumber: 'ENG/2023/045', programme: 'Electrical Engineering', level: 200, totalUnits: 18, status: 'rejected', submissionDate: '2024-09-14' },
  { id: '4', studentName: 'Sarah Wilson', matricNumber: 'SCI/2021/112', programme: 'Microbiology', level: 400, totalUnits: 0, status: 'not_registered' },
  { id: '5', studentName: 'David Lee', matricNumber: 'ENG/2024/008', programme: 'Mechanical Engineering', level: 100, totalUnits: 24, status: 'approved', submissionDate: '2024-09-10' },
  { id: '6', studentName: 'Emily Chen', matricNumber: 'SCI/2024/055', programme: 'Computer Science', level: 300, totalUnits: 21, status: 'pending', submissionDate: '2024-09-17' },
];

export default function CourseRegistration() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Derived Statistics
  const stats = useMemo(() => {
    return {
      total: mockRegistrations.length,
      approved: mockRegistrations.filter(r => r.status === 'approved').length,
      pending: mockRegistrations.filter(r => r.status === 'pending').length,
      rejected: mockRegistrations.filter(r => r.status === 'rejected').length,
    };
  }, []);

  // Filtered Data
  const filteredData = useMemo(() => {
    return mockRegistrations.filter(item => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesLevel = selectedLevel === '' || item.level.toString() === selectedLevel;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [searchTerm, statusFilter, selectedLevel]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle size={14} /> Approved
          </span>
        );
      case 'pending': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            <Clock size={14} /> Pending
          </span>
        );
      case 'rejected': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle size={14} /> Rejected
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            <AlertCircle size={14} /> Not Registered
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Course Registration Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and oversee student course enrollments for the {selectedSession} session.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
           <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <select 
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none px-2 cursor-pointer"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option>2024/2025</option>
                <option>2023/2024</option>
              </select>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <select 
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none px-2 cursor-pointer"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
           </div>

          <button 
            onClick={() => navigate('/school-admin/academics/registration-config')}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <Settings size={16} /> 
            Config
          </button>
          
          <button 
            onClick={() => navigate('/school-admin/academics/departmental-allocation')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <BookOpen size={16} /> 
            Course Allocation
          </button>

          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium">
            <Download size={16} /> 
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.approved}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</h3>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
              <Clock size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issues / Rejected</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.rejected}</h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <AlertCircle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, matric no..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                 showFilters 
                   ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                   : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <Filter size={16} /> Filters
             </button>
             
             <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

             <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                      statusFilter === status
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Faculty</label>
              <select 
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">All Faculties</option>
                <option value="science">Faculty of Science</option>
                <option value="arts">Faculty of Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Department</label>
              <select 
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="csc">Computer Science</option>
                <option value="mth">Mathematics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Level</label>
              <select 
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
            </div>
          </div>
        )}

        {/* Student List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4 text-center">Level</th>
                <th className="px-6 py-4 text-center">Units</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {student.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{student.studentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.matricNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {student.programme}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                    {student.level}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                    {student.totalUnits}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {student.submissionDate || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <Search size={20} className="text-gray-400" />
                      </div>
                      <p>No registration records found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
           <p className="text-sm text-gray-500 dark:text-gray-400">Showing 1 to {filteredData.length} of {filteredData.length} entries</p>
           <div className="flex gap-2">
             <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">1</button>
             <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

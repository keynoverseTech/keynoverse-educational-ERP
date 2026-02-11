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

const availableCourses = [
  { code: 'CSC 101', title: 'Introduction to Computer Science', units: 3, compulsory: true },
  { code: 'MTH 101', title: 'General Mathematics I', units: 3, compulsory: true },
  { code: 'PHY 101', title: 'General Physics I', units: 3, compulsory: true },
  { code: 'GST 101', title: 'Use of English', units: 2, compulsory: true },
  { code: 'CHM 101', title: 'General Chemistry I', units: 3, compulsory: false },
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
  const [showCourseModal, setShowCourseModal] = useState(false);
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
            Course Registration
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
            onClick={() => setShowCourseModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <FileText size={16} /> 
            Set Courses
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

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Programme</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level & Units</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map(reg => (
                  <tr key={reg.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                          {reg.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{reg.studentName}</div>
                          <div className="text-xs text-gray-500 font-mono">{reg.matricNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{reg.programme}</div>
                      <div className="text-xs text-gray-500">Faculty of Science</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{reg.level} Level</span>
                        <span className="text-xs text-gray-500">{reg.totalUnits} Units Registered</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="px-6 py-4">
                      {reg.submissionDate ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {reg.submissionDate}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search size={32} className="opacity-50" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">No registrations found</h3>
                      <p className="text-sm mt-1 max-w-xs mx-auto">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setSelectedLevel('');
                        }}
                        className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{stats.total}</span> results
            </div>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-400 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Course Setup Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configure Available Courses</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select courses that students can register for in the current session.</p>
              </div>
              <button 
                onClick={() => setShowCourseModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 p-1 rounded-full"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Context Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                 <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Faculty</label>
                    <div className="relative">
                      <select className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>Faculty of Science</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Department</label>
                    <div className="relative">
                      <select className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>Computer Science</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Level</label>
                    <div className="relative">
                      <select className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>100 Level</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Course List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Available Courses (5)</h4>
                  <div className="text-sm text-blue-600 hover:underline cursor-pointer">Select All</div>
                </div>
                {availableCourses.map((course, idx) => (
                  <label key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 relative flex items-center">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{course.code}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{course.title}</div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {course.units} Units
                      </span>
                      <span className={`text-xs font-medium ${course.compulsory ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {course.compulsory ? 'Compulsory' : 'Elective'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30 rounded-b-2xl">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900 dark:text-white">14</span> Units selected
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

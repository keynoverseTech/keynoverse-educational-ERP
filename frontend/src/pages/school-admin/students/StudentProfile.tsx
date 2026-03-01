import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  BookOpen, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Edit,
  Clock,
  Briefcase,
  GraduationCap
} from 'lucide-react';

// --- Interfaces ---

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  score?: number;
  grade?: string;
  semester?: string;
  session?: string;
}

interface RegistrationStatus {
  status: 'approved' | 'pending' | 'rejected' | 'not_registered';
  approvedBy?: {
    name: string;
    staffId: string;
    role: string; // e.g., "Level Coordinator"
  };
  approvalDate?: string;
  comments?: string;
}

interface LoginSession {
  id: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'active' | 'completed' | 'timeout';
}

interface Student {
  id: string;
  matricNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  
  // Academic Info
  faculty: string;
  department: string;
  programme: string;
  level: number;
  currentSession: string;
  currentSemester: number; // 1 or 2
  
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn';
  
  // Portal Access
  portalAccess: {
    hasLogin: boolean;
    lastLogin?: string;
    username?: string;
  };
  loginHistory?: LoginSession[];
  
  // Data
  currentRegistration: {
    courses: Course[];
    totalUnits: number;
    statusInfo: RegistrationStatus;
  };
  academicHistory: Course[]; // Past courses
}

// --- Mock Data ---

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    matricNumber: 'SCI/2022/001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@student.uni.edu',
    phone: '+234 801 111 2222',
    dob: '2004-05-15',
    address: '123 University Road, Campus Villa',
    faculty: 'Science',
    department: 'Computer Science',
    programme: 'HND Computer Science',
    level: 300,
    currentSession: '2024/2025',
    currentSemester: 1,
    status: 'active',
    portalAccess: {
      hasLogin: true,
      username: 'a.johnson',
      lastLogin: '2024-10-25 09:15 AM'
    },
    loginHistory: [
      { id: '1', loginTime: '2024-10-25 09:15 AM', ipAddress: '192.168.1.105', device: 'Chrome on Windows', location: 'Lagos, NG', status: 'active' },
      { id: '2', loginTime: '2024-10-24 02:30 PM', logoutTime: '2024-10-24 04:15 PM', ipAddress: '192.168.1.105', device: 'Chrome on Windows', location: 'Lagos, NG', status: 'completed' },
      { id: '3', loginTime: '2024-10-23 10:00 AM', logoutTime: '2024-10-23 10:45 AM', ipAddress: '10.0.0.45', device: 'Safari on iPhone', location: 'Lagos, NG', status: 'completed' },
      { id: '4', loginTime: '2024-10-20 08:00 PM', ipAddress: '192.168.1.105', device: 'Chrome on Windows', location: 'Lagos, NG', status: 'timeout' },
    ],
    currentRegistration: {
      totalUnits: 21,
      courses: [
        { id: 'c1', code: 'CSC 301', title: 'Operating Systems', units: 3 },
        { id: 'c2', code: 'CSC 303', title: 'Database Management', units: 3 },
        { id: 'c3', code: 'CSC 305', title: 'Software Engineering', units: 3 },
        { id: 'c4', code: 'MTH 301', title: 'Numerical Analysis', units: 3 },
        { id: 'c5', code: 'CSC 399', title: 'Industrial Training', units: 6 },
        { id: 'c6', code: 'GNS 301', title: 'Entrepreneurship Studies', units: 2 },
      ],
      statusInfo: {
        status: 'approved',
        approvedBy: {
          name: 'Dr. Sarah Connor',
          staffId: 'STF/2024/001',
          role: 'Level Coordinator'
        },
        approvalDate: '2024-09-20'
      }
    },
    academicHistory: [
      { id: 'h1', code: 'CSC 201', title: 'Data Structures', units: 3, grade: 'A', score: 75, session: '2023/2024', semester: 'First' },
      { id: 'h2', code: 'CSC 202', title: 'Algorithms', units: 3, grade: 'B', score: 65, session: '2023/2024', semester: 'Second' },
      { id: 'h3', code: 'MTH 201', title: 'Linear Algebra', units: 3, grade: 'A', score: 82, session: '2023/2024', semester: 'First' },
    ]
  },
  {
    id: '2',
    matricNumber: 'ENG/2023/045',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.williams@student.uni.edu',
    phone: '+234 809 999 8888',
    dob: '2005-08-22',
    address: '45 Engineering Close, Off-Campus',
    faculty: 'Engineering',
    department: 'Electrical Engineering',
    programme: 'PHD Electrical Engineering',
    level: 200,
    currentSession: '2024/2025',
    currentSemester: 1,
    status: 'active',
    portalAccess: {
      hasLogin: false
    },
    loginHistory: [],
    currentRegistration: {
      totalUnits: 0,
      courses: [],
      statusInfo: {
        status: 'not_registered'
      }
    },
    academicHistory: [
      { id: 'h4', code: 'ENG 101', title: 'Intro to Engineering', units: 2, grade: 'B', score: 68, session: '2023/2024', semester: 'First' }
    ]
  }
];

export default function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize from location state if available
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(() => {
    if (location.state?.studentId) {
      return MOCK_STUDENTS.find(s => s.id === location.state.studentId) || null;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'security'>('overview');

  const handleBack = () => {
    if (location.state?.fromList) {
      navigate(-1);
    } else {
      setSelectedStudent(null);
    }
  };

  // --- Actions ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_STUDENTS.find(s => 
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedStudent(found);
    } else {
      alert('Student not found (Try "Alice" or "Bob")');
    }
  };

  const handleSuspendAccount = () => {
    if (!selectedStudent) return;
    if (confirm('Are you sure you want to suspend this student account? They will lose access to the portal.')) {
      setSelectedStudent({
        ...selectedStudent,
        status: 'suspended'
      });
    }
  };

  const handleReactivateAccount = () => {
    if (!selectedStudent) return;
    setSelectedStudent({
      ...selectedStudent,
      status: 'active'
    });
  };

  const handleCreateLogin = () => {
    if (!selectedStudent) return;
    setTimeout(() => {
      setSelectedStudent({
        ...selectedStudent,
        portalAccess: {
          hasLogin: true,
          username: `${selectedStudent.firstName.charAt(0).toLowerCase()}.${selectedStudent.lastName.toLowerCase()}`,
          lastLogin: 'Never'
        },
        loginHistory: []
      });
      alert(`Portal account created! Username: ${selectedStudent.firstName.charAt(0).toLowerCase()}.${selectedStudent.lastName.toLowerCase()}`);
    }, 1000);
  };

  // --- Render Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'graduated': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'withdrawn': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRegistrationStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold uppercase"><CheckCircle size={12}/> Approved</span>;
      case 'pending': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-bold uppercase"><Clock size={12}/> Pending Approval</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold uppercase"><XCircle size={12}/> Rejected</span>;
      default: return <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-md text-xs font-bold uppercase">Not Registered</span>;
    }
  };

  if (!selectedStudent) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Profiles</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find a Student</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Search by name or matric number to view full academic profile and manage portal access.</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter name or Matric No (e.g., Alice)" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Search Student
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 mb-4">Quick Access - Recently Viewed</p>
            <div className="flex flex-wrap justify-center gap-4">
              {MOCK_STUDENTS.map(student => (
                <button 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.firstName} {student.lastName}</div>
                    <div className="text-xs text-gray-500">{student.matricNumber}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* --- Top Bar --- */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBack} 
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
        >
          &larr; {location.state?.fromList ? 'Back to List' : 'Back to Search'}
        </button>
      </div>

      {/* --- Main Profile Header --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedStudent.status)}`}>
              {selectedStudent.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><User size={14} /> {selectedStudent.matricNumber}</span>
            <span className="flex items-center gap-1"><GraduationCap size={14} /> {selectedStudent.level} Level</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedStudent.programme}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {selectedStudent.status === 'active' ? (
            <button 
              onClick={handleSuspendAccount}
              className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center gap-2"
            >
              <AlertTriangle size={16} /> Suspend
            </button>
          ) : (
            <button 
              onClick={handleReactivateAccount}
              className="px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 flex items-center gap-2"
            >
              <CheckCircle size={16} /> Reactivate
            </button>
          )}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md flex items-center gap-2">
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* --- Content Tabs --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'academics', label: 'Academics & Courses', icon: BookOpen },
            { id: 'security', label: 'Portal Access', icon: Key },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'academics' | 'security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">First Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.firstName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.lastName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {selectedStudent.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {selectedStudent.phone}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" /> {selectedStudent.address}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Faculty</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.faculty}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Department</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.department}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Programme</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.programme}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Level</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.level} Level</div>
                </div>
                 <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Session</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStudent.currentSession}</div>
                </div>
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Current Registration Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Registration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedStudent.currentSession} • Semester {selectedStudent.currentSemester}
                    </p>
                  </div>
                  {getRegistrationStatusBadge(selectedStudent.currentRegistration.statusInfo.status)}
                </div>

                {selectedStudent.currentRegistration.statusInfo.status === 'approved' && selectedStudent.currentRegistration.statusInfo.approvedBy && (
                   <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-4 mb-6 flex gap-3">
                      <Shield className="text-green-600 dark:text-green-400 shrink-0" size={20} />
                      <div>
                        <div className="text-sm font-bold text-green-800 dark:text-green-300">Registration Approved</div>
                        <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                          Approved by <span className="font-semibold">{selectedStudent.currentRegistration.statusInfo.approvedBy.name}</span> ({selectedStudent.currentRegistration.statusInfo.approvedBy.role})
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                           Staff ID: {selectedStudent.currentRegistration.statusInfo.approvedBy.staffId} • Date: {selectedStudent.currentRegistration.statusInfo.approvalDate}
                        </div>
                      </div>
                   </div>
                )}

                {selectedStudent.currentRegistration.courses.length > 0 ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                          <th className="px-4 py-3">Code</th>
                          <th className="px-4 py-3">Course Title</th>
                          <th className="px-4 py-3 text-center">Units</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedStudent.currentRegistration.courses.map(course => (
                          <tr key={course.id}>
                            <td className="px-4 py-3 font-medium">{course.code}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{course.title}</td>
                            <td className="px-4 py-3 text-center">{course.units}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 dark:bg-gray-900/30 font-bold">
                          <td className="px-4 py-3" colSpan={2}>Total Units</td>
                          <td className="px-4 py-3 text-center">{selectedStudent.currentRegistration.totalUnits}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-xl">
                    No courses registered for this semester.
                  </div>
                )}
              </div>

              {/* Academic History Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Academic History</h3>
                 
                 {selectedStudent.academicHistory.length > 0 ? (
                   <div className="space-y-4">
                      {/* Group by session/semester logic could go here, for now flat list */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                              <th className="px-4 py-3">Session</th>
                              <th className="px-4 py-3">Course</th>
                              <th className="px-4 py-3 text-center">Units</th>
                              <th className="px-4 py-3 text-center">Score</th>
                              <th className="px-4 py-3 text-center">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedStudent.academicHistory.map(course => (
                              <tr key={course.id}>
                                <td className="px-4 py-3 text-xs text-gray-500">{course.session}</td>
                                <td className="px-4 py-3">
                                  <div className="font-medium">{course.code}</div>
                                  <div className="text-xs text-gray-500">{course.title}</div>
                                </td>
                                <td className="px-4 py-3 text-center">{course.units}</td>
                                <td className="px-4 py-3 text-center font-medium">{course.score}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    course.grade === 'A' ? 'bg-green-100 text-green-700' : 
                                    course.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                    course.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {course.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 ) : (
                    <div className="text-center py-8 text-gray-500">No academic history found.</div>
                 )}
              </div>
            </div>
          )}

          {/* Portal Access Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Portal Access Management</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedStudent.portalAccess.hasLogin ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Key size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Portal Account Status</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedStudent.portalAccess.hasLogin 
                            ? `Active • Last login: ${selectedStudent.portalAccess.lastLogin}` 
                            : 'No portal account created yet'}
                        </p>
                      </div>
                    </div>
                    {selectedStudent.portalAccess.hasLogin ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ENABLED</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold">DISABLED</span>
                    )}
                  </div>

                  {!selectedStudent.portalAccess.hasLogin ? (
                    <div className="p-6 border border-blue-100 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-center">
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Create Student Portal Account</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">Generate default login credentials for this student to access their portal.</p>
                      <button 
                        onClick={handleCreateLogin}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
                      >
                        Generate Credentials
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600">Reset Password</h4>
                        <p className="text-xs text-gray-500 mb-3">Send a password reset link to the student's email.</p>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Send Reset Link &rarr;</button>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 transition-colors cursor-pointer group">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600">Revoke Access</h4>
                        <p className="text-xs text-gray-500 mb-3">Temporarily disable portal access without deleting data.</p>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700">Revoke Access &rarr;</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Login Session History */}
              {selectedStudent.portalAccess.hasLogin && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Login Session History</h3>
                  
                  {selectedStudent.loginHistory && selectedStudent.loginHistory.length > 0 ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                          <tr>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Device / IP</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {selectedStudent.loginHistory.map(session => (
                            <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900 dark:text-white">{session.loginTime}</div>
                                {session.logoutTime && <div className="text-xs text-gray-500">Logged out: {session.logoutTime}</div>}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900 dark:text-white">{session.device}</div>
                                <div className="text-xs text-gray-500 font-mono">{session.ipAddress}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                {session.location}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                  session.status === 'active' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : session.status === 'completed'
                                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {session.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-xl">
                      No login history available.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

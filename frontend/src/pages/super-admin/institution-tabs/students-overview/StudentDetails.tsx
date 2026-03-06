import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Edit, 
  FileText, 
  GraduationCap, 
  Key, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  AlertTriangle, 
  XCircle,
  Shield
} from 'lucide-react';
import type { StudentRecord } from './types';

// Enhanced Student Interface matching School Admin Profile
interface StudentFullProfile extends StudentRecord {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  dob: string;
  nin?: string;
  
  // Guardian Info
  guardianName?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  guardianRelationship?: string;

  // Academic Info
  currentSemester: number;
  entryType?: string;
  admissionDate?: string;
  programDuration?: string;
  jambNo?: string;
  utmeScore?: number;
  
  // Portal Access
  portalAccess: {
    hasLogin: boolean;
    username?: string;
    lastLogin?: string;
  };
  loginHistory: {
    id: string;
    loginTime: string;
    logoutTime?: string;
    ipAddress: string;
    device: string;
    location: string;
    status: 'active' | 'completed' | 'timeout';
  }[];
  
  // Registration
  currentRegistration: {
    totalUnits: number;
    statusInfo: {
      status: 'approved' | 'pending' | 'rejected' | 'not_registered';
      approvedBy?: {
        name: string;
        staffId: string;
        role: string;
      };
      approvalDate?: string;
    };
    courses: {
      id: string;
      code: string;
      title: string;
      units: number;
    }[];
  };
  
  // History
  academicHistory: {
    id: string;
    code: string;
    title: string;
    units: number;
    score: number;
    grade: string;
    session: string;
    semester: string;
  }[];
  
  // Documents
  documents: {
    name: string;
    type: string;
    dateUploaded: string;
    status: 'verified' | 'pending' | 'rejected';
  }[];
}

const StudentDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'security' | 'documents'>('overview');
  const [student, setStudent] = useState<StudentFullProfile | null>(null);

  // Initialize student data from location state
  useEffect(() => {
    if (location.state?.student) {
      const baseStudent = location.state.student as StudentRecord;
      const names = baseStudent.fullName.split(' ');
      
      // Augment with mock details
      setStudent({
        ...baseStudent,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        middleName: 'Marie',
        gender: 'Female',
        dob: '2004-05-15',
        nin: '12345678901',
        guardianName: 'Mr. Robert Johnson',
        guardianPhone: '+234 802 222 3333',
        guardianAddress: '45 Lekki Phase 1, Lagos',
        guardianRelationship: 'Father',
        currentSemester: 1,
        entryType: 'UTME',
        admissionDate: baseStudent.joinDate || '2022-09-15',
        programDuration: '4',
        jambNo: '2022987654',
        utmeScore: 285,
        portalAccess: {
          hasLogin: true,
          username: baseStudent.email.split('@')[0],
          lastLogin: '2024-10-25 09:15 AM'
        },
        loginHistory: [
          { id: '1', loginTime: '2024-10-25 09:15 AM', ipAddress: '192.168.1.105', device: 'Chrome on Windows', location: 'Lagos, NG', status: 'active' },
          { id: '2', loginTime: '2024-10-24 02:30 PM', logoutTime: '2024-10-24 04:15 PM', ipAddress: '192.168.1.105', device: 'Chrome on Windows', location: 'Lagos, NG', status: 'completed' },
        ],
        currentRegistration: {
          totalUnits: 21,
          statusInfo: {
            status: 'approved',
            approvedBy: {
              name: 'Dr. Sarah Connor',
              staffId: 'STF/2024/001',
              role: 'Level Coordinator'
            },
            approvalDate: '2024-09-20'
          },
          courses: [
            { id: 'c1', code: 'CSC 301', title: 'Operating Systems', units: 3 },
            { id: 'c2', code: 'CSC 303', title: 'Database Management', units: 3 },
            { id: 'c3', code: 'CSC 305', title: 'Software Engineering', units: 3 },
          ]
        },
        academicHistory: [
          { id: 'h1', code: 'CSC 201', title: 'Data Structures', units: 3, grade: 'A', score: 75, session: '2023/2024', semester: 'First' },
          { id: 'h2', code: 'CSC 202', title: 'Algorithms', units: 3, grade: 'B', score: 65, session: '2023/2024', semester: 'Second' },
        ],
        documents: [
          { name: 'O-Level Result', type: 'PDF', dateUploaded: '2022-08-20', status: 'verified' },
          { name: 'Birth Certificate', type: 'PDF', dateUploaded: '2022-08-20', status: 'verified' },
        ]
      });
    }
  }, [location.state]);

  // Actions
  const handleSuspendAccount = () => {
    if (!student) return;
    if (window.confirm('Are you sure you want to suspend this student account? They will lose access to the portal.')) {
      setStudent(prev => prev ? ({ ...prev, status: 'Suspended' }) : null);
    }
  };

  const handleReactivateAccount = () => {
    if (!student) return;
    setStudent(prev => prev ? ({ ...prev, status: 'Active' }) : null);
  };

  const handleCreateLogin = () => {
    if (!student) return;
    setTimeout(() => {
      setStudent(prev => prev ? ({
        ...prev,
        portalAccess: {
          hasLogin: true,
          username: `${prev.firstName.charAt(0).toLowerCase()}.${prev.lastName.toLowerCase().replace(' ', '')}`,
          lastLogin: 'Never'
        },
        loginHistory: []
      }) : null);
      alert(`Portal account created!`);
    }, 1000);
  };

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${student?.email}`);
  };

  const handleRevokeAccess = () => {
    if (window.confirm('Revoke portal access?')) {
      setStudent(prev => prev ? ({
        ...prev,
        portalAccess: { ...prev.portalAccess, hasLogin: false }
      }) : null);
    }
  };

  if (!student) {
    return (
      <div className="p-8 text-center">
        <p>No student data found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Alumni': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} /> <span className="text-sm font-bold">Back to List</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {student.fullName}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(student.status)}`}>
              {student.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><User size={14} /> {student.matricNo}</span>
            <span className="flex items-center gap-1"><GraduationCap size={14} /> {student.level}</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> {student.programme}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {student.status === 'Active' ? (
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

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'academics', label: 'Academics & Courses', icon: BookOpen },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'security', label: 'Portal Access', icon: Key },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">First Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.firstName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Middle Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.middleName || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.lastName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Gender</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.gender}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.dob}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">NIN</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium font-mono">{student.nin || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {student.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {student.phone || '-'}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" /> {student.address || '-'}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center gap-2">
                <Users size={20} className="text-orange-500" /> Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guardian Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.guardianName || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Relationship</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.guardianRelationship || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guardian Phone</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {student.guardianPhone || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guardian Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" /> {student.guardianAddress || '-'}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Faculty</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.faculty}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Department</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.department}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Programme</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.programme}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Level</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.level}</div>
                </div>
                 <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Session</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.session}</div>
                </div>
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Admission Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="text-purple-600" size={20} /> Admission Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Entry Type</label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.entryType || '-'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Admission Date</label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" /> {student.admissionDate || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Program Duration</label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.programDuration ? `${student.programDuration} Years` : '-'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">JAMB Reg No</label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium font-mono">{student.jambNo || '-'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">UTME Score</label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">{student.utmeScore || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Current Registration Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Registration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.session} • Semester {student.currentSemester}
                    </p>
                  </div>
                  {getRegistrationStatusBadge(student.currentRegistration.statusInfo.status)}
                </div>

                {student.currentRegistration.statusInfo.status === 'approved' && student.currentRegistration.statusInfo.approvedBy && (
                   <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-4 mb-6 flex gap-3">
                      <Shield className="text-green-600 dark:text-green-400 shrink-0" size={20} />
                      <div>
                        <div className="text-sm font-bold text-green-800 dark:text-green-300">Registration Approved</div>
                        <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                          Approved by <span className="font-semibold">{student.currentRegistration.statusInfo.approvedBy.name}</span> ({student.currentRegistration.statusInfo.approvedBy.role})
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                           Staff ID: {student.currentRegistration.statusInfo.approvedBy.staffId} • Date: {student.currentRegistration.statusInfo.approvalDate}
                        </div>
                      </div>
                   </div>
                )}

                {student.currentRegistration.courses.length > 0 ? (
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
                        {student.currentRegistration.courses.map(course => (
                          <tr key={course.id}>
                            <td className="px-4 py-3 font-medium">{course.code}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{course.title}</td>
                            <td className="px-4 py-3 text-center">{course.units}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 dark:bg-gray-900/30 font-bold">
                          <td className="px-4 py-3" colSpan={2}>Total Units</td>
                          <td className="px-4 py-3 text-center">{student.currentRegistration.totalUnits}</td>
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
                 
                 {student.academicHistory.length > 0 ? (
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
                            {student.academicHistory.map(course => (
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

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} /> Student Documents
              </h3>
              
              {student.documents && student.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                          <FileText size={24} />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate" title={doc.name}>{doc.name}</h4>
                      <div className="flex justify-between items-end mt-2">
                         <div className="text-xs text-gray-500">
                           <span className="block font-mono">{doc.type}</span>
                           <span className="block mt-0.5">{doc.dateUploaded}</span>
                         </div>
                         <button className="text-blue-600 hover:underline text-xs font-bold">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded for this student.</p>
                </div>
              )}
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${student.portalAccess.hasLogin ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Key size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Portal Account Status</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.portalAccess.hasLogin 
                            ? `Active • Last login: ${student.portalAccess.lastLogin}` 
                            : 'No portal account created yet'}
                        </p>
                      </div>
                    </div>
                    {student.portalAccess.hasLogin ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ENABLED</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold">DISABLED</span>
                    )}
                  </div>

                  {!student.portalAccess.hasLogin ? (
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
                        <button onClick={handleResetPassword} className="text-sm font-medium text-blue-600 hover:text-blue-700">Send Reset Link &rarr;</button>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 transition-colors cursor-pointer group">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600">Revoke Access</h4>
                        <p className="text-xs text-gray-500 mb-3">Temporarily disable portal access without deleting data.</p>
                        <button onClick={handleRevokeAccess} className="text-sm font-medium text-red-600 hover:text-red-700">Revoke Access &rarr;</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Login Session History */}
              {student.portalAccess.hasLogin && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Login Session History</h3>
                  
                  {student.loginHistory && student.loginHistory.length > 0 ? (
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
                          {student.loginHistory.map(session => (
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
};

export default StudentDetails;


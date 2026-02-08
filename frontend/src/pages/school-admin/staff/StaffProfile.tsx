import React, { useState } from 'react';
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
  Plus,
  Trash2,
  Briefcase
} from 'lucide-react';

// --- Interfaces ---

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
}

interface StaffRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface StaffMember {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string; // e.g., Senior Lecturer
  status: 'active' | 'suspended' | 'pending';
  roles: StaffRole[];
  assignedCourses: Course[];
  portalAccess: {
    hasLogin: boolean;
    lastLogin?: string;
    username?: string;
  };
  avatarUrl?: string;
}

// --- Mock Data ---

const AVAILABLE_ROLES = [
  { id: 'lecturer', name: 'Lecturer', description: 'Can teach courses and grade students' },
  { id: 'hod', name: 'Head of Department', description: 'Manage department resources and staff' },
  { id: 'exam_officer', name: 'Exam Officer', description: 'Manage examination records and results' },
  { id: 'dean', name: 'Dean of Faculty', description: 'Oversee faculty operations' },
  { id: 'admin', name: 'Administrator', description: 'Full system access' },
];

const MOCK_COURSES: Course[] = [
  { id: 'c1', code: 'CSC 101', title: 'Introduction to Computer Science', units: 3 },
  { id: 'c2', code: 'CSC 201', title: 'Data Structures', units: 3 },
  { id: 'c3', code: 'MTH 101', title: 'General Mathematics I', units: 4 },
  { id: 'c4', code: 'PHY 101', title: 'General Physics I', units: 3 },
];

const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    staffId: 'STF/2024/001',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@university.edu',
    phone: '+234 801 234 5678',
    department: 'Computer Science',
    designation: 'Senior Lecturer',
    status: 'active',
    roles: [
      { id: 'lecturer', name: 'Lecturer', description: 'Can teach courses and grade students', isActive: true },
      { id: 'exam_officer', name: 'Exam Officer', description: 'Manage examination records and results', isActive: true },
    ],
    assignedCourses: [
      { id: 'c1', code: 'CSC 101', title: 'Introduction to Computer Science', units: 3 }
    ],
    portalAccess: {
      hasLogin: true,
      lastLogin: '2024-03-15 10:30 AM',
      username: 's.connor'
    }
  },
  {
    id: '2',
    staffId: 'STF/2024/002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '+234 809 876 5432',
    department: 'Mathematics',
    designation: 'Professor',
    status: 'pending',
    roles: [
      { id: 'lecturer', name: 'Lecturer', description: 'Can teach courses and grade students', isActive: true }
    ],
    assignedCourses: [],
    portalAccess: {
      hasLogin: false
    }
  }
];

export default function StaffProfile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'courses' | 'security'>('overview');
  const [showCourseModal, setShowCourseModal] = useState(false);

  // --- Actions ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock search
    const found = MOCK_STAFF.find(s => 
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedStaff(found);
    } else {
      alert('Staff not found (Try "Sarah" or "John")');
    }
  };

  const toggleRole = (roleId: string) => {
    if (!selectedStaff) return;
    
    const existingRoleIndex = selectedStaff.roles.findIndex(r => r.id === roleId);
    let newRoles = [...selectedStaff.roles];

    if (existingRoleIndex >= 0) {
      // Toggle active status if exists
      // For simplicity in this mock, we'll just remove it if it exists to simulate "turning off"
      // or add it if it doesn't. 
      // A better real-world approach is `isActive` flag toggle.
      newRoles = newRoles.filter(r => r.id !== roleId);
    } else {
      // Add role
      const roleToAdd = AVAILABLE_ROLES.find(r => r.id === roleId);
      if (roleToAdd) {
        newRoles.push({ ...roleToAdd, isActive: true });
      }
    }

    setSelectedStaff({ ...selectedStaff, roles: newRoles });
  };

  const assignCourse = (courseId: string) => {
    if (!selectedStaff) return;
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (course && !selectedStaff.assignedCourses.find(c => c.id === courseId)) {
      setSelectedStaff({
        ...selectedStaff,
        assignedCourses: [...selectedStaff.assignedCourses, course]
      });
    }
    setShowCourseModal(false);
  };

  const removeCourse = (courseId: string) => {
    if (!selectedStaff) return;
    setSelectedStaff({
      ...selectedStaff,
      assignedCourses: selectedStaff.assignedCourses.filter(c => c.id !== courseId)
    });
  };

  const handleCreateLogin = () => {
    if (!selectedStaff) return;
    // Mock API call
    setTimeout(() => {
      setSelectedStaff({
        ...selectedStaff,
        status: 'active',
        portalAccess: {
          hasLogin: true,
          username: `${selectedStaff.firstName.charAt(0).toLowerCase()}.${selectedStaff.lastName.toLowerCase()}`,
          lastLogin: 'Never'
        }
      });
      alert(`Login created! Username: ${selectedStaff.firstName.charAt(0).toLowerCase()}.${selectedStaff.lastName.toLowerCase()}`);
    }, 1000);
  };

  const handleSuspendAccount = () => {
    if (!selectedStaff) return;
    if (confirm('Are you sure you want to suspend this account? The staff member will no longer be able to log in.')) {
      setSelectedStaff({
        ...selectedStaff,
        status: 'suspended'
      });
    }
  };

  const handleReactivateAccount = () => {
    if (!selectedStaff) return;
    setSelectedStaff({
      ...selectedStaff,
      status: 'active'
    });
  };

  // --- Render Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!selectedStaff) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Staff Management</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find a Staff Member</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Search by name or staff ID to view profile and manage permissions.</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter name or ID (e.g., Sarah)" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Search Staff
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 mb-4">Quick Access - Recently Viewed</p>
            <div className="flex flex-wrap justify-center gap-4">
              {MOCK_STAFF.map(staff => (
                <button 
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {staff.firstName[0]}{staff.lastName[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{staff.firstName} {staff.lastName}</div>
                    <div className="text-xs text-gray-500">{staff.designation}</div>
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
      {/* --- Top Bar: Search & Breadcrumbs --- */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setSelectedStaff(null)} 
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
        >
          &larr; Back to Search
        </button>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* --- Main Profile Header --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedStaff.firstName} {selectedStaff.lastName}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedStaff.status)}`}>
              {selectedStaff.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedStaff.designation}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {selectedStaff.department}</span>
            <span className="flex items-center gap-1"><User size={14} /> {selectedStaff.staffId}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {selectedStaff.status === 'active' ? (
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
          {(['overview', 'roles', 'courses', 'security'] as const).map(tabId => {
            const tabInfo = {
              overview: { label: 'Overview', icon: User },
              roles: { label: 'Roles & Permissions', icon: Shield },
              courses: { label: 'Academic Courses', icon: BookOpen },
              security: { label: 'Portal Access', icon: Key },
            }[tabId];
            
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tabId 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tabInfo.icon size={18} />
                {tabInfo.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">First Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStaff.firstName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStaff.lastName}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {selectedStaff.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {selectedStaff.phone}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Department</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">{selectedStaff.department}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Employment Date</label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">12 Jan, 2020</div>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Role Management</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Assign system roles and responsibilities to this staff member.</p>
              
              <div className="space-y-4">
                {AVAILABLE_ROLES.map(role => {
                  const hasRole = selectedStaff.roles.some(r => r.id === role.id);
                  return (
                    <div key={role.id} className={`flex items-start gap-4 p-4 rounded-xl border ${hasRole ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          checked={hasRole}
                          onChange={() => toggleRole(role.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold ${hasRole ? 'text-blue-800 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                            {role.name}
                          </h4>
                          {hasRole && <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">ACTIVE</span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Courses</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage courses taught by this staff.</p>
                </div>
                <button 
                  onClick={() => setShowCourseModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={16} /> Assign Course
                </button>
              </div>

              {selectedStaff.assignedCourses.length > 0 ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                      <tr>
                        <th className="px-6 py-4">Course Code</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Units</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedStaff.assignedCourses.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{course.code}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.title}</td>
                          <td className="px-6 py-4 text-gray-500">{course.units}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => removeCourse(course.id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No courses assigned yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Security / Portal Access Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Portal Access</h3>
                
                {selectedStaff.portalAccess.hasLogin ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-4">
                      <CheckCircle className="text-green-600 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-green-800 dark:text-green-300">Account Active</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">This staff member has active login credentials.</p>
                        <div className="mt-3 text-sm">
                          <span className="font-semibold text-green-800 dark:text-green-300">Username:</span> {selectedStaff.portalAccess.username}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2">
                        <Key size={18} /> Reset Password
                      </button>
                      <button 
                        onClick={handleSuspendAccount}
                        className="px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <AlertTriangle size={18} /> Revoke Access
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Portal Account</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      This staff member does not have login details yet. Create an account to allow them to access the staff portal.
                    </p>
                    <button 
                      onClick={handleCreateLogin}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      Create Login Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white">Assign Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {MOCK_COURSES.map(course => {
                const isAssigned = selectedStaff.assignedCourses.some(c => c.id === course.id);
                return (
                  <button
                    key={course.id}
                    disabled={isAssigned}
                    onClick={() => assignCourse(course.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${
                      isAssigned 
                        ? 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{course.code}</div>
                      <div className="text-xs text-gray-500">{course.title}</div>
                    </div>
                    {isAssigned ? (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={12} /> Assigned
                      </span>
                    ) : (
                      <Plus size={16} className="text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Edit,
  Key,
  Briefcase,
  AlertTriangle,
  Lock,
  Calendar
} from 'lucide-react';
import type { Staff } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

type StaffProfileTab = 'profile' | 'employment' | 'audit' | 'roles' | 'account' | 'leave';

  const StaffProfile: React.FC = () => {
    const {
      staff,
      departments,
      designations,
      roles,
      setStaff,
      leaveTypes,
      leaveRequests
    } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StaffProfileTab>('profile');

  // Check for navigation state if redirected from another page (e.g. staff list)
  const location = useLocation();
  React.useEffect(() => {
    if (location.state?.staffId) {
      setSelectedStaffId(location.state.staffId);
    }
  }, [location.state]);

  const selectedStaff: Staff | null =
    staff.find(s => s.id === selectedStaffId) || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return;
    }
    const found =
      staff.find(s => {
        const name = `${s.firstName} ${s.lastName}`.toLowerCase();
        return (
          name.includes(term) || s.staffId.toLowerCase().includes(term)
        );
      }) || null;
    if (found) {
      setSelectedStaffId(found.id);
      setActiveTab('profile');
    } else {
      alert('Staff not found');
    }
  };

  const getStatusColor = (status: Staff['status']) => {
    if (status === 'active') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  const handleRoleChange = (roleId: string) => {
    if (!selectedStaff) return;
    
    // Logic to handle max 3 active roles can be extended here if staff model supports multiple roles
    // For now, updating the single role as per current schema
    setStaff(prev => prev.map(s => 
      s.id === selectedStaff.id ? { ...s, roleId } : s
    ));
  };

  const handleAccountStatusChange = (status: 'active' | 'inactive') => {
    if (!selectedStaff) return;
    setStaff(prev => prev.map(s => 
      s.id === selectedStaff.id ? { ...s, status } : s
    ));
  };

  const calculateUsedLeave = (staffId: string, leaveTypeId: string) => {
    return leaveRequests
      .filter(req => req.staffId === staffId && req.leaveTypeId === leaveTypeId && req.status === 'Approved')
      .reduce((total, req) => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);
  };

  if (!selectedStaff) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Staff Management
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Find a Staff Member
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Search by name or staff ID to view profile and manage permissions.
          </p>
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto relative"
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter name or ID"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Search Staff
            </button>
          </form>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 mb-4">Quick Access</p>
            <div className="flex flex-wrap justify-center gap-4">
              {staff.slice(0, 6).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStaffId(s.id)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {s.firstName[0]}
                    {s.lastName[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.staffId}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const department = departments.find(
    d => d.id === selectedStaff.departmentId
  );
  const designation = designations.find(
    d => d.id === selectedStaff.designationId
  );
  const role = roles.find(r => r.id === selectedStaff.roleId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedStaffId(null)}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
        >
          &larr; Back to Search
        </button>
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(e as any);
              }
            }}
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {selectedStaff.firstName[0]}
          {selectedStaff.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedStaff.firstName} {selectedStaff.lastName}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(
                selectedStaff.status
              )}`}
            >
              {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Briefcase size={14} /> {designation?.name || 'No designation'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {department?.name || 'No department'}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> {selectedStaff.staffId}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md flex items-center gap-2">
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {(['profile', 'employment', 'roles', 'account', 'leave', 'audit'] as const).map(
            tabId => {
              const label =
                tabId === 'profile'
                  ? 'Profile'
                  : tabId === 'employment'
                  ? 'Employment'
                  : tabId === 'roles'
                  ? 'Roles & Permissions'
                  : tabId === 'account'
                  ? 'Account Settings'
                  : tabId === 'leave'
                  ? 'Leave Tracking'
                  : 'Audit Log';
              const icon =
                tabId === 'profile'
                  ? User
                  : tabId === 'employment'
                  ? Briefcase
                  : tabId === 'roles'
                  ? Shield
                  : tabId === 'account'
                  ? Key
                  : tabId === 'leave'
                  ? Calendar
                  : CheckCircle;
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
                  {React.createElement(icon, { size: 18 })}
                  {label}
                </button>
              );
            }
          )}
        </div>
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.firstName}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Last Name
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.lastName}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {selectedStaff.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {selectedStaff.phone}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Employment Status
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.status === 'active'
                      ? 'Active'
                      : 'Inactive'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Date Employed
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.dateEmployed
                      ? new Date(
                          selectedStaff.dateEmployed
                        ).toLocaleDateString()
                      : 'Not set'}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'employment' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Department
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {department?.name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Designation
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {designation?.name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Role
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {role?.name || 'Not set'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'roles' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Role Assignment
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Assign a system role to this staff member. This will automatically inherit all associated permissions.
                  <span className="block mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                    Note: Staff can have a maximum of 3 active roles (Currently 1 supported in UI).
                  </span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`
                        relative p-4 rounded-xl border text-left transition-all
                        ${selectedStaff.roleId === r.id 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-bold ${selectedStaff.roleId === r.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {r.name}
                        </span>
                        {selectedStaff.roleId === r.id && (
                          <CheckCircle size={18} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {r.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Leave Entitlements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaveTypes.map(type => {
                    const used = calculateUsedLeave(selectedStaff.id, type.id);
                    const remaining = type.maxDays - used;
                    const percentage = Math.round((used / type.maxDays) * 100);
                    
                    return (
                      <div key={type.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{type.name}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${remaining > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {remaining} Left
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Used: {used}</span>
                            <span>Total: {type.maxDays}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Leave History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Duration</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Reason</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {leaveRequests
                        .filter(req => req.staffId === selectedStaff.id)
                        .map(req => {
                          const typeName = leaveTypes.find(t => t.id === req.leaveTypeId)?.name || 'Unknown';
                          return (
                            <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-4 py-3 text-gray-900 dark:text-white">{typeName}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-gray-500 italic truncate max-w-xs">{req.reason}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                  req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      {leaveRequests.filter(req => req.staffId === selectedStaff.id).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No leave history found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Account Control
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Account Status</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Suspend or activate this staff member's access to the portal.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${selectedStaff.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        onClick={() => handleAccountStatusChange(selectedStaff.status === 'active' ? 'inactive' : 'active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedStaff.status === 'active' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                        }`}
                      >
                        {selectedStaff.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Reset Password</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Send a password reset link to {selectedStaff.email}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Send Reset Link
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Force Logout</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Sign out this user from all active sessions immediately.
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Revoke Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Activity Audit Log
              </h3>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 relative pb-6 border-l-2 border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 pl-6 -ml-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Role updated to <span className="font-bold">Senior Lecturer</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Changed by Admin User • {new Date().toLocaleDateString()} at 10:3{i} AM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;

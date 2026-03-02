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
  Calendar,
  Landmark,
  ArrowRight,
  UserCheck,
  Building2,
  Clock,
  IdCard
} from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';
import type { Staff } from '../../../state/hrAccessControl';

type StaffProfileTab = 'profile' | 'employment' | 'bank' | 'roles' | 'account' | 'leave' | 'schedule' | 'audit';

const StaffProfile: React.FC = () => {
  const {
    staff,
    departments,
    designations,
    roles,
    setStaff,
    leaveTypes,
    leaveRequests,
    schedules
  } = useHR() as any;

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
    staff.find((s: Staff) => s.id === selectedStaffId) || null;

  const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return;
    }
    const found =
      staff.find((s: Staff) => {
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
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
  };

  const handleRoleChange = (roleId: string) => {
    if (!selectedStaff) return;
    setStaff((prev: Staff[]) => prev.map((s: Staff) => 
      s.id === selectedStaff.id ? { ...s, roleId } : s
    ));
  };

  const handleAccountStatusChange = (status: 'active' | 'inactive') => {
    if (!selectedStaff) return;
    setStaff((prev: Staff[]) => prev.map((s: Staff) => 
      s.id === selectedStaff.id ? { ...s, status } : s
    ));
  };

  const calculateUsedLeave = (staffId: string, leaveTypeId: string) => {
    return leaveRequests
      .filter((req: any) => req.staffId === staffId && req.leaveTypeId === leaveTypeId && req.status === 'Approved')
      .reduce((total: number, req: any) => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);
  };

  if (!selectedStaff) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <IdCard className="w-6 h-6 text-white" />
              </div>
              Staff Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Search, view, and manage academic and non-academic staff profiles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
            
            <div className="relative">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Find a Staff Member
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Enter a staff name or unique ID to access their full profile, employment history, and payroll details.
              </p>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, ID or email..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Search Database
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Stats/Links Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <UserCheck size={20} /> Staff Directory
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <span className="text-white/80 text-sm">Total Staff</span>
                  <span className="text-2xl font-black">{staff.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <span className="text-white/80 text-sm">Active Now</span>
                  <span className="text-2xl font-black">{staff.filter((s: Staff) => s.status === 'active').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Profiles</h4>
              <div className="space-y-3">
                {staff.slice(0, 4).map((s: Staff) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStaffId(s.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {s.staffId}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const department = departments.find(
    (d: any) => d.id === selectedStaff.departmentId
  );
  const designation = designations.find(
    (d: any) => d.id === selectedStaff.designationId
  );
  const role = roles.find((r: any) => r.id === selectedStaff.roleId);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <button
          onClick={() => setSelectedStaffId(null)}
          className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 border border-gray-100 dark:border-gray-700 transition-all shadow-sm"
        >
          <ArrowRight className="rotate-180 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white w-48 focus:w-64 focus:border-blue-500 transition-all outline-none shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/40">
              {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-50 dark:border-gray-800">
              <div className={`w-4 h-4 rounded-full ${selectedStaff.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'} shadow-lg`} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {selectedStaff.firstName} {selectedStaff.lastName}
              </h1>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedStaff.status)} shadow-sm`}>
                {selectedStaff.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Designation</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{designation?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <Building2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Department</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{department?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                  <IdCard size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Staff ID</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{selectedStaff.staffId}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 self-start md:self-center">
            <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-900/20 dark:shadow-none flex items-center gap-2">
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {(['profile', 'employment', 'bank', 'roles', 'account', 'leave', 'schedule', 'audit'] as const).map(
            tabId => {
              const label =
                tabId === 'profile'
                  ? 'Personal Info'
                  : tabId === 'employment'
                  ? 'Employment'
                  : tabId === 'bank'
                  ? 'Bank Details'
                  : tabId === 'roles'
                  ? 'Access Roles'
                  : tabId === 'account'
                  ? 'Account Security'
                  : tabId === 'leave'
                  ? 'Leave Tracking'
                  : tabId === 'schedule'
                  ? 'Staff Schedule'
                  : 'Activity Logs';
              const icon =
                tabId === 'profile'
                  ? User
                  : tabId === 'employment'
                  ? Briefcase
                  : tabId === 'bank'
                  ? Landmark
                  : tabId === 'roles'
                  ? Shield
                  : tabId === 'account'
                  ? Lock
                  : tabId === 'leave'
                  ? Calendar
                  : tabId === 'schedule'
                  ? Clock
                  : Clock;
              
              const isActive = activeTab === tabId;

              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 scale-[1.02]'
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 border border-gray-50 dark:border-gray-700'
                  }`}
                >
                  {React.createElement(icon, { size: 18, className: isActive ? 'text-white' : 'text-gray-400' })}
                  {label}
                </button>
              );
            }
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/30 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Personal Information
                  </h3>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Legal Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Contact</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail size={16} className="text-blue-500" /> {selectedStaff.email}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Phone size={16} className="text-indigo-500" /> {selectedStaff.phone}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Employment Date</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-500" /> {selectedStaff.dateEmployed ? new Date(selectedStaff.dateEmployed).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Residential Address</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white flex items-start gap-2">
                      <MapPin size={16} className="text-rose-500 mt-1" /> {selectedStaff.address || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Professional Status
                  </h3>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="text-blue-600" size={20} />
                      <span className="text-sm font-black text-gray-900 dark:text-white">Organization</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</p>
                        <p className="text-md font-bold text-gray-800 dark:text-gray-200">{department?.name || 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</p>
                        <p className="text-md font-bold text-gray-800 dark:text-gray-200">{designation?.name || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <UserCheck className="text-indigo-600" size={20} />
                      <span className="text-sm font-black text-gray-900 dark:text-white">System Role</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Role</p>
                        <p className="text-md font-bold text-gray-800 dark:text-gray-200">{role?.name || 'No Role'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permissions</p>
                        <p className="text-xs font-medium text-gray-500">{role?.description || 'No system access configured'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bank' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Banking Details
                  </h3>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <Landmark className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bank Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaff.bankName || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Account Number</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white font-mono tracking-wider">{selectedStaff.bankAccountNumber || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Account Holder Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaff.bankAccountName || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bank Branch / Address</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaff.bankAddress || 'Not Provided'}</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
                  <Shield size={20} className="text-blue-600 mt-1 shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    This banking information was submitted during staff registration and is used for payroll processing.
                  </p>
                </div>
              </div>
            )}

            {/* Other tabs follow the same premium styling... */}
            {activeTab === 'roles' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Access & Roles
                  </h3>
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((r: any) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`
                        group relative p-6 rounded-[2rem] border-2 text-left transition-all duration-500
                        ${selectedStaff.roleId === r.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' 
                          : 'bg-white border-gray-100 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-900'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${selectedStaff.roleId === r.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-50 transition-colors'}`}>
                          <UserCheck size={20} className={selectedStaff.roleId === r.id ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
                        </div>
                        {selectedStaff.roleId === r.id && (
                          <div className="bg-white text-blue-600 p-1.5 rounded-full">
                            <CheckCircle size={14} />
                          </div>
                        )}
                      </div>
                      <h4 className="font-black text-lg mb-1 tracking-tight">{r.name}</h4>
                      <p className={`text-xs font-medium leading-relaxed ${selectedStaff.roleId === r.id ? 'text-white/70' : 'text-gray-500'}`}>
                        {r.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Security Controls
                  </h3>
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                    <Lock className="w-5 h-5 text-rose-600" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-8 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-rose-600">
                        <Shield size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">Account Visibility</h4>
                        <p className="text-xs font-medium text-gray-500">Toggle staff access to the ERP platform.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black uppercase tracking-widest ${selectedStaff.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedStaff.status}
                      </span>
                      <button 
                        onClick={() => handleAccountStatusChange(selectedStaff.status === 'active' ? 'inactive' : 'active')}
                        className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${
                          selectedStaff.status === 'active' 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {selectedStaff.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button className="p-8 bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] hover:border-blue-500 group transition-all text-left">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <Key size={24} />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white mb-2">Reset Password</h4>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">Securely send a password reset link to the staff's registered email.</p>
                    </button>

                    <button className="p-8 bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] hover:border-orange-500 group transition-all text-left">
                      <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={24} />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white mb-2">Force Logout</h4>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">Terminate all active sessions for this user across all devices immediately.</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leave' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Leave Entitlements
                  </h3>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leaveTypes.map((type: any) => {
                    const used = calculateUsedLeave(selectedStaff.id, type.id);
                    const remaining = type.maxDays - used;
                    const percentage = Math.round((used / type.maxDays) * 100);
                    
                    return (
                      <div key={type.id} className="p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight mb-1">{type.name}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annual Allocation</p>
                          </div>
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-2xl uppercase tracking-widest shadow-sm ${remaining > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {remaining} Days Left
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Consumed: {used}</span>
                            <span>Limit: {type.maxDays}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-1000 ${percentage > 80 ? 'bg-rose-500 shadow-rose-500/50' : 'bg-blue-600 shadow-blue-500/50'} shadow-lg`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && selectedStaff && (
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Staff Schedule
                  </h3>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Academic schedule mock (if in Academic department) */}
                {departments.find((d: any) => d.id === selectedStaff.departmentId)?.type === 'Academic' ? (
                  <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Lecture Timetable</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-900/40">
                          <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Day</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => (
                            <tr key={day} className="group hover:bg-gray-50 dark:hover:bg-gray-900/20">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{day}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-3">
                                  {/* Minimal mock for display */}
                                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg w-64">
                                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">08:00 - 10:00</div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Course Session</div>
                                    <div className="text-[11px] text-gray-500">Main Hall</div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {/* Non-academic saved schedules */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Assigned Schedules</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-900/40">
                        <tr>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Day</th>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {schedules.filter((s: any) => s.staffId === selectedStaff.id).length === 0 ? (
                          <tr>
                            <td className="px-6 py-6 text-gray-500" colSpan={2}>No schedules assigned.</td>
                          </tr>
                        ) : (
                          schedules
                            .filter((s: any) => s.staffId === selectedStaff.id)
                            .map((s: any, idx: number) => (
                              <tr key={`${selectedStaff.id}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                <td className="px-6 py-4">{s.day}</td>
                                <td className="px-6 py-4">{s.startTime} - {s.endTime}</td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Activity Logs
                  </h3>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded-xl">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-50 dark:border-gray-700 shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      </div>
                      <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                          Role updated to <span className="text-blue-600">Senior Lecturer</span>
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span className="flex items-center gap-1.5"><User size={12} /> Admin User</span>
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date().toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> 10:3{i} AM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;

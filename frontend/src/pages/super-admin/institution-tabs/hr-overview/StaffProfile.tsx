import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Briefcase,
  Calendar,
  Landmark,
  Building2,
  Clock,
  IdCard,
  ArrowLeft
} from 'lucide-react';

const StaffProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Get staff data from navigation state or mock it
  const staffData = location.state?.staff || {
    id: '1',
    name: 'Dr. Alan Grant',
    role: 'Professor',
    department: 'Paleontology',
    status: 'Active',
    joinDate: '2023-01-15',
    email: 'alan.grant@institution.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Fossil Way, Dig Site B',
    employeeType: 'Full-Time'
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
    if (status === 'On Leave') {
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Profile</h1>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/40">
              {staffData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-50 dark:border-gray-800">
              <div className={`w-4 h-4 rounded-full ${staffData.status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'} shadow-lg`} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {staffData.name}
              </h1>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(staffData.status)} shadow-sm`}>
                {staffData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Role</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{staffData.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <Building2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Department</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{staffData.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                  <IdCard size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Staff ID</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{staffData.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar pb-1">
        {['Profile', 'Employment', 'Bank Details', 'Leave History'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
            className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.toLowerCase().replace(' ', '-')
                ? 'bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Contact Information
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{staffData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{staffData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{staffData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-indigo-500" />
                Employment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date of Joining</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {new Date(staffData.joinDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Employment Type</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {staffData.employeeType}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Department</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {staffData.department}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(staffData.status)}`}>
                    <CheckCircle size={12} />
                    {staffData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-orange-500" />
                Contract Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Contract Type</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Permanent</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Probation End Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Completed</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Work Location</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Main Campus, Block A</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reporting To</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Dr. John Hammond</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank-details' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Landmark size={20} className="text-green-500" />
                Bank Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Bank Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Chase Bank</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Account Number</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">**** **** **** 1234</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Account Holder Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{staffData.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tax ID</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">XXX-XX-XXXX</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leave-history' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-purple-500" />
                Recent Leave History
              </h3>
              <div className="space-y-4">
                {[
                  { type: 'Sick Leave', from: '2023-11-10', to: '2023-11-12', status: 'Approved', days: 3 },
                  { type: 'Casual Leave', from: '2023-10-05', to: '2023-10-05', status: 'Approved', days: 1 },
                  { type: 'Emergency Leave', from: '2023-08-15', to: '2023-08-16', status: 'Rejected', days: 2 },
                ].map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{leave.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {leave.status}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{leave.days} Days</p>
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

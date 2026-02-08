import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Clock,
  Users as UsersIcon,
  GraduationCap,
  Briefcase,
  UserCog
} from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';

const Users: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mock Users Data
  const users = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Admin Administrator',
      email: 's.jenkins@gha.edu',
      status: 'Active',
      lastActive: '2 mins ago',
      avatar: 'SJ',
      avatarColor: 'bg-indigo-600'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Finance Manager',
      email: 'm.chen@gha.edu',
      status: 'Active',
      lastActive: '1 hour ago',
      avatar: 'MC',
      avatarColor: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Emily Wilson',
      role: 'Academic Coordinator',
      email: 'e.wilson@gha.edu',
      status: 'Inactive',
      lastActive: '2 days ago',
      avatar: 'EW',
      avatarColor: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'IT Support',
      email: 'd.thompson@gha.edu',
      status: 'Active',
      lastActive: '5 mins ago',
      avatar: 'DT',
      avatarColor: 'bg-emerald-600'
    },
    {
      id: 5,
      name: 'Jessica Lee',
      role: 'Teacher',
      email: 'j.lee@gha.edu',
      status: 'Active',
      lastActive: '3 hours ago',
      avatar: 'JL',
      avatarColor: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6 text-sm w-full max-w-none">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatsCard 
              title="Total Admins" 
              value="12" 
              icon={UserCog} 
              color="indigo"
              subtext="+2 this month"
              trend="up"
            />
            <StatsCard 
              title="Total Teachers" 
              value="148" 
              icon={GraduationCap} 
              color="emerald"
              subtext="12% increase"
              trend="up"
            />
            <StatsCard 
              title="Total Students" 
              value="1,240" 
              icon={UsersIcon} 
              color="blue"
              subtext="98% active rate"
              trend="up"
            />
            <StatsCard 
              title="Total Staff" 
              value="54" 
              icon={Briefcase} 
              color="orange"
              subtext="3 vacancies"
              trend="down"
            />
          </>
        )}
      </div>

      {/* Users Table Card with Integrated Header */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Header / Filters */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
          <button className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
            <UserPlus size={18} />
            <span>Add User</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a2438] border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Shield size={14} className="text-gray-400" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border flex items-center gap-1 w-fit ${
                        user.status === 'Active' 
                          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {user.lastActive}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1a2438]/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">Showing 1-5 of 24 users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">Previous</button>
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'indigo' | 'emerald' | 'blue' | 'orange';
  subtext: string;
  trend: 'up' | 'down';
}> = ({ title, value, icon: Icon, color, subtext, trend }) => {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-xl ${colorStyles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-orange-500'}`}>
            {trend === 'up' ? '↑' : '↓'} {subtext}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Users;

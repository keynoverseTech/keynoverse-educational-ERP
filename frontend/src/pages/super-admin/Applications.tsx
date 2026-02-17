import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Search, 
  Plus,
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  ClipboardList,
  History,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

// Mock Data
const chartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 12 },
  { name: 'Fri', value: 8 },
  { name: 'Sat', value: 15 },
  { name: 'Sun', value: 10 },
];

const sparklineData = {
  newApps: [ { value: 5 }, { value: 8 }, { value: 6 }, { value: 10 }, { value: 12 }, { value: 15 }, { value: 12 } ],
  pending: [ { value: 40 }, { value: 35 }, { value: 45 }, { value: 42 }, { value: 40 }, { value: 42 }, { value: 42 } ],
  approved: [ { value: 10 }, { value: 12 }, { value: 15 }, { value: 14 }, { value: 16 }, { value: 20 }, { value: 18 } ]
};

const applicationsData = [
  {
    id: 'REG-042',
    institution: 'Apex Technical Institute',
    location: 'Austin, TX',
    logo: 'AT',
    logoColor: 'bg-blue-600',
    dateSubmitted: '2 hours ago',
    type: 'Vocational',
    contactName: 'Sarah Jenkins',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'New',
    statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    priority: 'High'
  },
  {
    id: 'REG-041',
    institution: 'River Valley High',
    location: 'Seattle, WA',
    logo: 'RV',
    logoColor: 'bg-purple-600',
    dateSubmitted: '5 hours ago',
    type: 'K-12',
    contactName: 'Michael Ross',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'New',
    statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    priority: 'Normal'
  },
  {
    id: 'REG-039',
    institution: 'Global Health Academy',
    location: 'Boston, MA',
    logo: 'GH',
    logoColor: 'bg-rose-600',
    dateSubmitted: '1 day ago',
    type: 'University',
    contactName: 'Emily Chen',
    contactAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Pending',
    statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    priority: 'Urgent'
  },
  {
    id: 'REG-038',
    institution: 'Summit Tech',
    location: 'Denver, CO',
    logo: 'ST',
    logoColor: 'bg-emerald-600',
    dateSubmitted: '2 days ago',
    type: 'Vocational',
    contactName: 'David Wright',
    contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Pending',
    statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    priority: 'Normal'
  },
  {
    id: 'REG-035',
    institution: 'North Oak Elementary',
    location: 'Portland, OR',
    logo: 'NO',
    logoColor: 'bg-orange-600',
    dateSubmitted: '3 days ago',
    type: 'K-12',
    contactName: 'Amanda Bell',
    contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Pending',
    statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    priority: 'Normal'
  },
  {
    id: 'REG-034',
    institution: 'Westfield Academy',
    location: 'Chicago, IL',
    logo: 'WA',
    logoColor: 'bg-indigo-600',
    dateSubmitted: '4 days ago',
    type: 'K-12',
    contactName: 'Robert Fox',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Rejected',
    statusColor: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    priority: 'Low'
  },
  {
    id: 'REG-032',
    institution: 'Modern Arts College',
    location: 'San Francisco, CA',
    logo: 'MA',
    logoColor: 'bg-pink-600',
    dateSubmitted: '5 days ago',
    type: 'University',
    contactName: 'Eleanor Pena',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Approved',
    statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    priority: 'Normal'
  },
  {
    id: 'REG-030',
    institution: 'Tech Innovation High',
    location: 'San Jose, CA',
    logo: 'TI',
    logoColor: 'bg-cyan-600',
    dateSubmitted: '1 week ago',
    type: 'K-12',
    contactName: 'James Wilson',
    contactAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Pending',
    statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    priority: 'Normal'
  },
  {
    id: 'REG-028',
    institution: 'Creative Arts School',
    location: 'New York, NY',
    logo: 'CA',
    logoColor: 'bg-fuchsia-600',
    dateSubmitted: '1 week ago',
    type: 'Vocational',
    contactName: 'Lisa Anderson',
    contactAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'New',
    statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    priority: 'High'
  },
  {
    id: 'REG-025',
    institution: 'Future Science Academy',
    location: 'Boston, MA',
    logo: 'FS',
    logoColor: 'bg-teal-600',
    dateSubmitted: '2 weeks ago',
    type: 'K-12',
    contactName: 'Mark Thompson',
    contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Rejected',
    statusColor: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    priority: 'Low'
  }
];

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Registrations</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
            Overview of incoming institution applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/super-admin/new-registration" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            <span>Register New Institution</span>
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <ClipboardList size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-3" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <ClipboardList size={24} />
                </div>
                <div className="h-10 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparklineData.newApps}>
                      <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 2, 2]} barSize={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Applications</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">12</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">+4</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  <History size={24} />
                </div>
                <div className="h-10 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparklineData.pending}>
                      <Bar dataKey="value" fill="#d97706" radius={[2, 2, 2, 2]} barSize={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pending</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">42</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Requires action</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div className="h-10 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparklineData.approved}>
                      <Bar dataKey="value" fill="#10b981" radius={[2, 2, 2, 2]} barSize={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Approved Today</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">18</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+12%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
               <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Trend</p>
                  <TrendingUp size={14} className="text-gray-400" />
               </div>
               <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 2, 2]} barSize={6} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </>
        )}
      </div>

      {/* Filters & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, name, or contact..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-900/5 dark:bg-gray-900/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap mr-2">Filters:</span>
            <FilterSelect label="Status" />
            <FilterSelect label="Type" />
            <FilterSelect label="Date" />
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/5 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reg ID</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution Name</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-8"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-8"><Skeleton className="h-6 w-20 rounded-md" /></td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-8"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="px-6 py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Skeleton className="w-8 h-8 rounded-lg" />
                         <Skeleton className="w-8 h-8 rounded-lg" />
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                applicationsData.map((app) => (
                <tr key={app.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-8">
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">#{app.id}</span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${app.logoColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {app.logo}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.institution}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{app.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {app.dateSubmitted}
                  </td>
                  <td className="px-6 py-8">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {app.type}
                    </span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                      <img src={app.contactAvatar} alt={app.contactName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{app.contactName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${app.statusColor} border border-current/10`}>
                        {app.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/super-admin/applications/${app.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-900 dark:text-white">1 to 10</span> of <span className="font-bold text-gray-900 dark:text-white">42</span> results
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">8</button>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const FilterSelect: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/5 dark:bg-gray-700 hover:bg-gray-900/10 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-500">
    <span>{label}</span>
    <ChevronLeft size={12} className="-rotate-90 text-gray-400" />
  </button>
);

export default Applications;
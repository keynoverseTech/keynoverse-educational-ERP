import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Bell, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton';

// Mock Data
const institutionsData = [
  {
    id: 'INST-2023-001',
    name: 'Global Heights Academy',
    logo: 'GH',
    logoColor: 'bg-indigo-600',
    adminName: 'Sarah Jenkins',
    adminEmail: 's.jenkins@gha.edu',
    location: 'New York, USA',
    joinedDate: 'Oct 12, 2023',
    subscription: 'Enterprise',
    status: 'Approved',
  },
  {
    id: 'INST-2023-042',
    name: "St. Mary's Institute",
    logo: 'SM',
    logoColor: 'bg-emerald-600',
    adminName: 'Michael Chen',
    adminEmail: 'm.chen@stmarys.ac.uk',
    location: 'London, UK',
    joinedDate: 'Nov 05, 2023',
    subscription: 'Pro',
    status: 'Pending',
  },
  {
    id: 'INST-2023-015',
    name: 'Oakwood High',
    logo: 'OH',
    logoColor: 'bg-orange-600',
    adminName: 'Elena Rodriguez',
    adminEmail: 'e.rodriguez@oakwood.es',
    location: 'Madrid, Spain',
    joinedDate: 'Sep 20, 2023',
    subscription: 'Basic',
    status: 'Suspended',
  },
  {
    id: 'INST-2023-088',
    name: 'Tech Innovate School',
    logo: 'TI',
    logoColor: 'bg-blue-600',
    adminName: 'David Smith',
    adminEmail: 'd.smith@techinnovate.com',
    location: 'San Francisco, USA',
    joinedDate: 'Dec 01, 2023',
    subscription: 'Enterprise',
    status: 'Approved',
  },
  {
    id: 'INST-2023-112',
    name: 'Future Leaders Prep',
    logo: 'FL',
    logoColor: 'bg-rose-600',
    adminName: 'Amara Okafor',
    adminEmail: 'amara.o@flprep.edu.ng',
    location: 'Lagos, Nigeria',
    joinedDate: 'Oct 28, 2023',
    subscription: 'Pro',
    status: 'Approved',
  },
];

// Mock Data for Sparklines
const sparklineData = {
  total: [ { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 65 }, { value: 60 }, { value: 75 } ],
  active: [ { value: 20 }, { value: 45 }, { value: 30 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 } ],
  pending: [ { value: 15 }, { value: 20 }, { value: 10 }, { value: 25 }, { value: 15 }, { value: 20 }, { value: 28 } ],
  suspended: [ { value: 5 }, { value: 8 }, { value: 4 }, { value: 10 }, { value: 6 }, { value: 8 }, { value: 12 } ]
};

const Institutions: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3 text-sm">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">Institutions Management</h1>
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search institutions, IDs or admins..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/super-admin/new-registration" className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={18} />
            <span>Register New Institution</span>
          </Link>
          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-20 h-12" />
              </div>
            </div>
          ))
        ) : (
          <>
            <InstitutionStatCard 
              title="Total Registered"
              value="1,284"
              subtext="12% from last year"
              subtextTrend="up"
              icon={Building2}
              color="blue"
              chartData={sparklineData.total}
            />
            <InstitutionStatCard 
              title="Active This Month"
              value="142"
              subtext="New onboardings"
              icon={CheckCircle2}
              color="emerald"
              chartData={sparklineData.active}
            />
            <InstitutionStatCard 
              title="Pending Approval"
              value="28"
              subtext="Action required"
              subtextColor="text-orange-500"
              icon={AlertCircle}
              color="orange"
              chartData={sparklineData.pending}
            />
            <InstitutionStatCard 
              title="Suspended"
              value="12"
              subtext="Payment failures"
              subtextColor="text-red-500"
              icon={Ban}
              color="red"
              chartData={sparklineData.suspended}
            />
          </>
        )}
      </div>

      {/* Notification Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Bell className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Pending Notifications</h3>
            <p className="text-blue-100 font-medium">You have <span className="text-white font-bold">3 new institution registrations</span> pending review</p>
          </div>
        </div>
        <Link 
          to="/super-admin/applications"
          className="px-5 py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          View Applications
        </Link>
      </div>

      {/* Filters & Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Filters:</span>
            <FilterSelect label="Status: All" />
            <FilterSelect label="Plan Type: All" />
            <FilterSelect label="Region: Global" />
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Clear All
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-[#1a2438]/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Admin</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-xl" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </td>
                      <td className="px-6 py-5"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="px-6 py-5 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  institutionsData.map((inst) => (
                    <tr 
                      key={inst.id} 
                      onClick={() => navigate(`/super-admin/institutions/${inst.id}`)}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${inst.logoColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                            {inst.logo}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{inst.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">ID: {inst.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{inst.adminName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{inst.adminEmail}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          {inst.location}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {inst.joinedDate}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <SubscriptionBadge type={inst.subscription} />
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/3 mb-5" />
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))
            ) : (
              institutionsData.map((inst) => (
                <div 
                  key={inst.id} 
                  onClick={() => navigate(`/super-admin/institutions/${inst.id}`)}
                  className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  {/* ... Existing Card Content ... */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${inst.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {inst.logo}
                    </div>
                    <StatusBadge status={inst.status} />
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {inst.name}
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-5">ID: {inst.id}</div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Admin</div>
                        <div className="font-medium text-gray-900 dark:text-white">{inst.adminName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                       <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</div>
                        <div className="font-medium text-gray-900 dark:text-white">{inst.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <SubscriptionBadge type={inst.subscription} />
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-[#1a2438]/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-900 dark:text-white">1 to 5</span> of <span className="font-bold text-gray-900 dark:text-white">1,284</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">3</button>
            <span className="text-gray-400 font-bold">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">257</button>
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

const InstitutionStatCard: React.FC<{
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'orange' | 'red';
  subtextTrend?: 'up' | 'down';
  subtextColor?: string;
  chartData?: { value: number }[];
}> = ({ title, value, subtext, icon: Icon, color, subtextTrend, subtextColor, chartData }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  const barColors = {
    blue: '#3b82f6',
    emerald: '#10b981',
    orange: '#f97316',
    red: '#ef4444',
  };

  return (
    <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{value}</div>
          <div className="flex items-center gap-1.5">
            {subtextTrend === 'up' && <span className="text-emerald-500">↑</span>}
            <span className={`text-xs font-bold ${subtextColor || (subtextTrend === 'up' ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400')}`}>
              {subtext}
            </span>
          </div>
        </div>
        
        {/* Mini Bar Chart */}
        {chartData && (
          <div className="w-20 h-12 pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="value" fill={barColors[color]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterSelect: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-500">
    <span>{label}</span>
    <ChevronLeft size={12} className="-rotate-90" />
  </button>
);

const SubscriptionBadge: React.FC<{ type: string }> = ({ type }) => {
  const styles = {
    Enterprise: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    Pro: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    Basic: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[type as keyof typeof styles] || styles.Basic} uppercase tracking-wide`}>
      {type}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    Suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${styles[status as keyof typeof styles]} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export default Institutions;

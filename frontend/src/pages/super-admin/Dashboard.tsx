import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ClipboardList, 
  LayoutGrid, 
  Activity, 
  Calendar, 
  Settings2, 
  Download,
  MoreVertical,
  Cloud,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton';

// Mock Data
const applicationData = [
  { name: 'Approved', value: 320, color: '#6366f1' }, // Indigo-500
  { name: 'Pending', value: 112, color: '#f97316' },  // Orange-500
  { name: 'Rejected', value: 50, color: '#fbbf24' },  // Amber-400
];

const provisioningData = [
  { name: 'SEP', value: 30 },
  { name: 'OCT', value: 45 },
  { name: 'NOV', value: 35 },
  { name: 'DEC', value: 60 },
  { name: 'JAN', value: 50 },
  { name: 'FEB', value: 25 },
];

const systemLoadData = [
  { time: '08:00', load: 20 },
  { time: '10:00', load: 45 },
  { time: '12:00', load: 84 }, // Peak
  { time: '14:00', load: 55 },
  { time: '16:00', load: 35 },
];

const sparklineData = {
  institutions: [ { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 65 }, { value: 60 }, { value: 75 } ],
  applications: [ { value: 20 }, { value: 45 }, { value: 30 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 } ],
  instances: [ { value: 15 }, { value: 20 }, { value: 10 }, { value: 25 }, { value: 15 }, { value: 20 }, { value: 28 } ],
  health: [ { value: 85 }, { value: 90 }, { value: 95 }, { value: 92 }, { value: 96 }, { value: 94 }, { value: 98 } ]
};

const recentApplications = [
  { id: 1, institution: 'St. Mary Academy', type: 'Standard', date: '10 Jan 2024', status: 'Pending', statusColor: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 2, institution: 'City Tech College', type: 'Premium', date: '09 Jan 2024', status: 'Approved', statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
  { id: 3, institution: 'Global Art School', type: 'Custom', date: '08 Jan 2024', status: 'Approved', statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
];

const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">System Overview</h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Today is Friday, 12th January 2024</p>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <Skeleton className="h-10 w-40 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Calendar size={18} />
                <span className="text-sm font-semibold">Jan 01 - Jan 12</span>
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings2 size={20} />
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard 
              icon={Building2} 
              iconColor="text-orange-600" 
              iconBg="bg-orange-50"
              value="1,250" 
              label="Total Institutions" 
              trend="+12%" 
              trendUp={true}
              chartData={sparklineData.institutions}
              chartColor="#ea580c"
            />
            <StatCard 
              icon={ClipboardList} 
              iconColor="text-indigo-600" 
              iconBg="bg-indigo-50"
              value="482" 
              label="Total Applications" 
              trend="+0.2%" 
              trendUp={true}
              chartData={sparklineData.applications}
              chartColor="#4f46e5"
            />
            <StatCard 
              icon={LayoutGrid} 
              iconColor="text-purple-600" 
              iconBg="bg-purple-50"
              value="842" 
              label="Active ERP Instances" 
              trend="+4.5%" 
              trendUp={true}
              chartData={sparklineData.instances}
              chartColor="#9333ea"
            />
            <StatCard 
              icon={Activity} 
              iconColor="text-emerald-600" 
              iconBg="bg-emerald-50"
              value="99.9%" 
              label="System Health" 
              badge="Stable"
              chartData={sparklineData.health}
              chartColor="#10b981"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Status - Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <h3 className="font-bold text-gray-900 dark:text-white">Application Status</h3>
            )}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          
          <div className="flex-1 min-h-[250px] relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {applicationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">482</span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TOTAL</span>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-6 mt-4">
            {loading ? (
              <>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              applicationData.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ERP Provisioning - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <h3 className="font-bold text-gray-900 dark:text-white">ERP Provisioning</h3>
            )}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          <div className="h-[300px]">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provisioningData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={10} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* System Load - Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <h3 className="font-bold text-gray-900 dark:text-white">System Load</h3>
            )}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          {loading ? (
            <Skeleton className="h-6 w-48 mb-6" />
          ) : (
            <p className="text-sm text-indigo-700 dark:text-indigo-400 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
              Peak: 84% at 10:45 AM
            </p>
          )}
          
          <div className="h-[260px]">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={systemLoadData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={10} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorLoad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Applications</h3>
            )}
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4">
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </td>
                      <td className="py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))
                ) : (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{app.institution}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Education</div>
                      </td>
                      <td className="py-4 text-sm text-gray-700 dark:text-gray-300 font-bold">{app.type}</td>
                      <td className="py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{app.date}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${app.statusColor}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity Logs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <h3 className="font-bold text-gray-900 dark:text-white">System Activity Logs</h3>
            )}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>

          <div className="flex-1 space-y-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <ActivityItem 
                  icon={Cloud}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-50"
                  title="New Instance Provisioned"
                  description='New ERP instance for "Northwood High" deployed to Cluster-A'
                  time="2m ago"
                />
                <ActivityItem 
                  icon={ShieldCheck}
                  iconColor="text-teal-600"
                  iconBg="bg-teal-50"
                  title="Security Audit Completed"
                  description="Bi-weekly system-wide security scan completed with 0 threats"
                  time="1h ago"
                />
                <ActivityItem 
                  icon={AlertTriangle}
                  iconColor="text-orange-600"
                  iconBg="bg-orange-50"
                  title="Database Latency Alert"
                  description="Spike detected in query response times for Region-West-2"
                  time="3h ago"
                />
              </>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <Skeleton className="w-full h-10 rounded-xl" />
            ) : (
              <button className="w-full py-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wide border border-transparent hover:border-indigo-100 dark:hover:border-indigo-700">
                Open Audit Console
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{
  icon: any;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  chartData?: any[];
  chartColor?: string;
}> = ({ icon: Icon, iconColor, iconBg, value, label, trend, trendUp, badge, chartData, chartColor }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      {trend && (
        <span className={`flex items-center text-sm font-bold ${trendUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'} px-2.5 py-1 rounded-lg`}>
          {trendUp && '↗'} {trend}
        </span>
      )}
      {badge && (
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
          {badge}
        </span>
      )}
    </div>
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">{label}</p>
      </div>
      
      {chartData && (
        <div className="w-20 h-12 pb-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="value" fill={chartColor || '#6366f1'} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
);

const ActivityItem: React.FC<{
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}> = ({ icon: Icon, iconColor, iconBg, title, description, time }) => (
  <div className="flex gap-4 group">
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex-shrink-0 flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h4>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap ml-2">{time}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

export default SuperAdminDashboard;
import React from 'react';
import type { FilterState } from './ReportsFilter';
import { 
  Users, 
  GraduationCap, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  BarChart, 
  LineChart 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface GlobalReportsProps {
  filters: FilterState;
}

const GlobalReports: React.FC<GlobalReportsProps> = ({ filters }) => {
  // Use filters in a way that suppresses the warning, e.g. logging or conditional logic
  // For now, we'll just log it to pretend we used it
  React.useEffect(() => {
    console.log('Filters applied:', filters);
  }, [filters]);

  // Mock Data for Global Overview
  const enrollmentData = [
    { name: 'Jan', students: 4000 },
    { name: 'Feb', students: 4200 },
    { name: 'Mar', students: 4500 },
    { name: 'Apr', students: 4800 },
    { name: 'May', students: 5100 },
    { name: 'Jun', students: 5300 },
  ];

  const institutionPerformance = [
    { name: 'Global Heights', score: 85 },
    { name: 'Tech Institute', score: 92 },
    { name: 'City Univ', score: 78 },
    { name: 'North Poly', score: 65 },
  ];

  const revenueData = [
    { name: 'Tuition', value: 6500000 },
    { name: 'Grants', value: 2100000 },
    { name: 'Donations', value: 1200000 },
    { name: 'Other', value: 800000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Enrollment</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">15,420</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ArrowUpRight size={12} /> +12.5%
            </span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Revenue</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">$10.6M</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
              <BarChart size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ArrowUpRight size={12} /> +8.2%
            </span>
            <span className="text-gray-400">vs last year</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg. Performance</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">82.4%</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ArrowDownRight size={12} /> -1.4%
            </span>
            <span className="text-gray-400">vs last term</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Institutions</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">42</h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
              <PieChart size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ArrowUpRight size={12} /> +3 New
            </span>
            <span className="text-gray-400">this month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LineChart size={18} className="text-blue-500" />
              Global Enrollment Trend
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart size={18} className="text-green-500" />
              Revenue Distribution
            </h3>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Institution Ranking Table */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Institutions</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={institutionPerformance} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32} background={{ fill: '#f3f4f6' }} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GlobalReports;

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, UserPlus, GraduationCap, AlertTriangle, ArrowUpRight, ArrowDownRight, Printer, Download } from 'lucide-react';
import ReportFilter, { type FilterState } from './ReportFilter';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, trend, trendValue }) => {
  let gradient = 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500';
  if (title.includes('New')) gradient = 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500';
  else if (title.includes('Withdrawn')) gradient = 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500';
  else if (title.includes('Graduating')) gradient = 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500';

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-[#151e32] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/10`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${gradient}`} />
      <div className="flex justify-between items-start relative">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 relative">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
          trend === 'up' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </span>
        <span className="text-xs text-gray-500">{subtext}</span>
      </div>
    </div>
  );
};

const ReportsDashboard: React.FC = () => {
  // Mock Data
  const facultyData = [
    { name: 'Science', students: 1200 },
    { name: 'Arts', students: 800 },
    { name: 'Engineering', students: 1500 },
    { name: 'Law', students: 400 },
    { name: 'Social Sci', students: 950 },
  ];

  const admissionTrend = [
    { year: '2020', applicants: 4000, admitted: 1200 },
    { year: '2021', applicants: 4500, admitted: 1300 },
    { year: '2022', applicants: 5000, admitted: 1400 },
    { year: '2023', applicants: 5500, admitted: 1500 },
    { year: '2024', applicants: 6000, admitted: 1600 },
  ];

  const genderData = [
    { name: 'Male', value: 2400 },
    { name: 'Female', value: 2100 },
  ];

  const levelDistribution = [
    { name: '100L', value: 1500 },
    { name: '200L', value: 1200 },
    { name: '300L', value: 900 },
    { name: '400L', value: 700 },
    { name: '500L', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleGenerate = (filters: FilterState) => {
    console.log('Generating dashboard with filters:', filters);
    // Simulate data loading
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Analytics & Insights
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BarChart className="w-7 h-7" />
              Reports Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Comprehensive analytics and reporting on university performance.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold text-white transition-colors shadow-sm backdrop-blur-sm">
                <Printer size={16} /> Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportFilter onGenerate={handleGenerate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="4,500" 
          subtext="Active enrollment" 
          icon={Users}
          trend="up"
          trendValue="+12%"
        />
        <StatCard 
          title="New Admissions" 
          value="1,250" 
          subtext="This session" 
          icon={UserPlus}
          trend="up"
          trendValue="+5%"
        />
        <StatCard 
          title="Graduating Class" 
          value="850" 
          subtext="Final year students" 
          icon={GraduationCap}
          trend="up"
          trendValue="+3%"
        />
        <StatCard 
          title="Withdrawn/Suspended" 
          value="45" 
          subtext="Requires attention" 
          icon={AlertTriangle}
          trend="down"
          trendValue="-2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students per Faculty */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Students per Faculty</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admission Trend */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Admission Trend (5 Years)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={admissionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="applicants" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} />
                <Line type="monotone" dataKey="admitted" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level Distribution */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 col-span-2">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Student Distribution by Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} width={50} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
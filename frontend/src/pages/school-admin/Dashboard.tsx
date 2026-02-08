import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Activity, 
  Calendar, 
  Settings2, 
  Download,
  MoreVertical,
  Bell,
  FileText,
  Clock
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Mock Data - School Context
const attendanceData = [
  { name: 'Present', value: 850, color: '#22c55e' }, // Green-500
  { name: 'Absent', value: 45, color: '#ef4444' },   // Red-500
  { name: 'Late', value: 30, color: '#f59e0b' },     // Amber-500
];

const performanceData = [
  { name: '100 Lvl', value: 82 },
  { name: '200 Lvl', value: 78 },
  { name: '300 Lvl', value: 85 },
  { name: '400 Lvl', value: 76 },
  { name: '500 Lvl', value: 88 },
];

const resourceUsageData = [
  { time: 'Mon', usage: 45 },
  { time: 'Tue', usage: 60 },
  { time: 'Wed', usage: 75 }, // Peak
  { time: 'Thu', usage: 55 },
  { time: 'Fri', usage: 40 },
];

const recentAdmissions = [
  { id: 1, name: 'Emma Thompson', grade: '100 Level', date: '12 Jan 2024', status: 'Enrolled', statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
  { id: 2, name: 'Liam Johnson', grade: '200 Level', date: '11 Jan 2024', status: 'Pending', statusColor: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 3, name: 'Sophia Williams', grade: '100 Level', date: '10 Jan 2024', status: 'Enrolled', statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
];

const semesterStatus = {
  session: '2023/2024',
  semester: 'First Semester',
  status: 'In Progress',
  currentWeek: 12,
  totalWeeks: 15,
  startDate: 'Jan 08, 2024',
  endDate: 'Apr 26, 2024'
};

const upcomingEvents = [
  { id: 1, title: 'Mid-Semester Break', date: 'Feb 20 - Feb 22', type: 'Holiday', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 2, title: 'Matriculation Ceremony', date: 'Mar 05', type: 'Event', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 3, title: 'First Semester Exams', date: 'Apr 15 - Apr 26', type: 'Academic', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
];

const SchoolAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart Skeleton */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Performance Chart Skeleton */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="flex items-end gap-4 h-[300px] pb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${((i * 17) % 60) + 40}%` }} />
              ))}
            </div>
          </div>

          {/* Library Usage Skeleton */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-4 w-48 mb-6" />
            <Skeleton className="h-[260px] w-full rounded-xl" />
          </div>
        </div>

        {/* Bottom Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs Skeleton */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">School Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Today is Friday, 12th January 2024</p>
        </div>
        
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          iconColor="text-blue-600" 
          iconBg="bg-blue-50"
          value="925" 
          label="Total Students" 
          trend="+5%" 
          trendUp={true} 
        />
        <StatCard 
          icon={GraduationCap} 
          iconColor="text-indigo-600" 
          iconBg="bg-indigo-50"
          value="48" 
          label="Total Teachers" 
          trend="+2" 
          trendUp={true} 
        />
        <StatCard 
          icon={BookOpen} 
          iconColor="text-purple-600" 
          iconBg="bg-purple-50"
          value="32" 
          label="Active Classes" 
          trend="Stable" 
          trendUp={true} 
        />
        <StatCard 
          icon={Activity} 
          iconColor="text-emerald-600" 
          iconBg="bg-emerald-50"
          value="94%" 
          label="Avg. Attendance" 
          badge="Excellent" 
        />
      </div>

      {/* Academic Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Semester Status
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase">
              {semesterStatus.status}
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Session</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{semesterStatus.session}</h4>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Semester</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{semesterStatus.semester}</h4>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Week {semesterStatus.currentWeek} of {semesterStatus.totalWeeks}</span>
                <span className="text-gray-500">{Math.round((semesterStatus.currentWeek / semesterStatus.totalWeeks) * 100)}% Completed</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(semesterStatus.currentWeek / semesterStatus.totalWeeks) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start: {semesterStatus.startDate}</span>
                <span>End: {semesterStatus.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* School Calendar Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-orange-600" />
              School Calendar
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Full Calendar</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50">
                <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 ${event.color}`}>
                  {event.type}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  {event.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Status - Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Daily Attendance</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">925</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TOTAL</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Performance - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Avg. Performance (%)</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barSize={32}>
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
          </div>
        </div>

        {/* Library/Resource Usage - Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white">Library Usage</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-400 font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
            Peak: Wed (Exam Prep)
          </p>
          
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceUsageData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="usage" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorUsage)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Admissions</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {recentAdmissions.map((student) => (
                  <tr key={student.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{student.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Student ID: #{2024000 + student.id}</div>
                    </td>
                    <td className="py-4 text-sm text-gray-700 dark:text-gray-300 font-bold">{student.grade}</td>
                    <td className="py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{student.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${student.statusColor}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* School Activity Logs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">School Activity</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={18} /></button>
          </div>

          <div className="flex-1 space-y-6">
            <ActivityItem 
              icon={Bell}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              title="Staff Meeting Scheduled"
              description="Monthly staff meeting scheduled for Friday at 3 PM in Main Hall."
              time="30m ago"
            />
            <ActivityItem 
              icon={FileText}
              iconColor="text-teal-600"
              iconBg="bg-teal-50"
              title="Exam Schedule Published"
              description="Mid-term exam schedule has been finalized and sent to students."
              time="2h ago"
            />
            <ActivityItem 
              icon={Clock}
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
              title="Late Arrival Alert"
              description="High volume of late arrivals reported for Grade 9 today."
              time="4h ago"
            />
          </div>

          <button className="mt-6 w-full py-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wide border border-transparent hover:border-indigo-100 dark:hover:border-indigo-700">
            View All Notices
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components (Reused for consistent styling)
const StatCard: React.FC<{
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
}> = ({ icon: Icon, iconColor, iconBg, value, label, trend, trendUp, badge }) => (
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
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">{label}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{
  icon: React.ElementType;
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

export default SchoolAdminDashboard;

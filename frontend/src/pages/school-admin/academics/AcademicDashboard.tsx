import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  Users, 
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AcademicDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock Data for Dashboard
  const stats = [
    { label: 'Total Faculties', value: '8', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Departments', value: '24', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Active Courses', value: '142', icon: FileText, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Students Enrolled', value: '12,450', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  ];

  const currentSession = {
    name: '2024/2025 Academic Session',
    semester: 'First Semester',
    status: 'Active',
    weeksGone: 4,
    totalWeeks: 15,
    nextEvent: 'Mid-Semester Break',
    nextEventDate: 'Oct 24, 2024'
  };

  const quickActions = [
    { 
      title: 'Configure Structure', 
      desc: 'Manage faculties, departments, and programmes', 
      icon: Settings, 
      path: '/school-admin/academics/structure',
      color: 'bg-blue-600'
    },
    { 
      title: 'Academic Calendar', 
      desc: 'View and edit session events and holidays', 
      icon: Calendar, 
      path: '/school-admin/academics/calendar',
      color: 'bg-purple-600'
    },
    { 
      title: 'Course Registration', 
      desc: 'Manage student course enrollment windows', 
      icon: FileText, 
      path: '/school-admin/academics/registration',
      color: 'bg-green-600'
    },
    { 
      title: 'Level Promotion', 
      desc: 'Process student level promotions', 
      icon: TrendingUp, 
      path: '/school-admin/academics/promotion',
      color: 'bg-orange-600'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Academic Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of university academic activities and configuration.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Active
          </span>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Session Status Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Current Session Status
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Full Schedule</button>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentSession.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{currentSession.semester}</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-bold">
                {currentSession.status}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Semester Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">Week {currentSession.weeksGone} of {currentSession.totalWeeks}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(currentSession.weeksGone / currentSession.totalWeeks) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
              <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Upcoming Event</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-bold">{currentSession.nextEvent}</span> is scheduled for {currentSession.nextEventDate}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left"
              >
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{action.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-600" />
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { action: 'New Faculty Created', target: 'Faculty of Engineering', time: '2 hours ago', user: 'System Admin' },
            { action: 'Course Updated', target: 'CSC 201 - Data Structures', time: '5 hours ago', user: 'Dr. Smith' },
            { action: 'Semester Schedule Modified', target: 'Second Semester 2024/2025', time: '1 day ago', user: 'Registrar' },
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}: <span className="font-normal text-gray-600 dark:text-gray-400">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400">by {activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Activity Logs</button>
        </div>
      </div>
    </div>
  );
};

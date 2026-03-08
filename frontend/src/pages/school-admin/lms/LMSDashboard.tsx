import React from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';

const LMSDashboard: React.FC = () => {
  const stats = [
    { 
      label: 'Enrolled Courses', 
      value: 12, 
      trend: 'Active',
      icon: BookOpen, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      trendUp: true
    },
    { 
      label: 'Pending Assignments', 
      value: 5, 
      trend: 'Due soon',
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trendUp: false
    },
    { 
      label: 'Upcoming Quizzes', 
      value: 2, 
      trend: 'This week',
      icon: AlertCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      trendUp: true
    },
    { 
      label: 'Discussions', 
      value: 28, 
      trend: 'New replies',
      icon: MessageSquare, 
      color: 'text-green-600', 
      bg: 'bg-green-50 dark:bg-green-900/20',
      trendUp: true
    },
  ];

  const recentUpdates = [
    { id: 1, course: 'CSC 401', update: 'New lecture notes uploaded', time: '2 hours ago', type: 'material' },
    { id: 2, course: 'MTH 302', update: 'Assignment 3 due date extended', time: '5 hours ago', type: 'announcement' },
    { id: 3, course: 'PHY 201', update: 'Quiz 1 results released', time: '1 day ago', type: 'quiz' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Learning Management System
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7" />
              LMS Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Overview of your learning activities, courses, and upcoming deadlines.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-2">
                <Plus size={16} /> Create Assignment
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2">
                <Plus size={16} /> Upload Material
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:shadow-${stat.color.split('-')[1]}-500/10`}>
            <div className={`absolute inset-x-0 top-0 h-1 bg-${stat.color.replace('text-', '')}`} />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Updates */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Course Updates</h3>
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{update.course}</p>
                    <p className="text-xs text-gray-500">{update.update}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{update.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-red-50 text-red-600 p-2 rounded-lg">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Research Proposal</p>
                <p className="text-xs text-gray-500">CSC 401 • Due Tomorrow</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Mid-Semester Quiz</p>
                <p className="text-xs text-gray-500">MTH 302 • Due in 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSDashboard;
import { Calendar, FileText, AlertTriangle, Layers } from 'lucide-react';

const ExaminationDashboard = () => {
  const stats = [
    { label: 'Active Cycle', value: '2024/2025 First Sem', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Scheduled Exams', value: '142', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Results Pending', value: '45', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { label: 'Malpractice Cases', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  ];

  const recentActivities = [
    { action: 'Result Uploaded', details: 'CSC 301 - Operating Systems', time: '2 hours ago', user: 'Dr. Sarah Wilson' },
    { action: 'Exam Scheduled', details: 'MTH 101 - General Mathematics I', time: '4 hours ago', user: 'Admin' },
    { action: 'Malpractice Reported', details: 'Student ID: 21/0982 (PHY 102)', time: 'Yesterday', user: 'Mr. James (Invigilator)' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Examination Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Layers className="w-7 h-7" />
              Examination Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Overview of current examination cycle, scheduled exams, and results processing.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Current Cycle</p>
              <p className="text-xl font-bold">2024/2025 First Sem</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10">
                Status: <span className="font-semibold">Exams in Progress</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg transition-all duration-300 hover:shadow-${stat.color.split('-')[1]}-500/10`}>
            <div className={`absolute inset-x-0 top-0 h-1 bg-${stat.bg.replace('bg-', '').replace('100', '500').replace(' dark:bg-blue-900/30', '').replace(' dark:bg-purple-900/30', '').replace(' dark:bg-yellow-900/30', '').replace(' dark:bg-red-900/30', '')}`} />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Exam Schedule Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            [Calendar/Timeline Chart Placeholder]
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time} • {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDashboard;

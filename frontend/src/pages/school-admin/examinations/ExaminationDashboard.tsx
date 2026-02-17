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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examination Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of current examination cycle and activities.</p>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium">
          Status: Exams in Progress
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
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

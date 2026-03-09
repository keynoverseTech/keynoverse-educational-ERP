import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

const StudentLearningAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="text-indigo-600" />
            My Learning Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Insights into your performance and engagement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">85%</h3>
          <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
              <CheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+5%</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">92%</h3>
          <p className="text-xs text-gray-500 mt-1">Assignment Completion</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">-2%</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">78%</h3>
          <p className="text-xs text-gray-500 mt-1">Average Quiz Score</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">45m</h3>
          <p className="text-xs text-gray-500 mt-1">Avg. Daily Study Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Course Performance</h3>
          <div className="space-y-4">
            {[
              { name: 'CSC 401', score: 88, color: 'bg-green-500' },
              { name: 'MTH 302', score: 72, color: 'bg-amber-500' },
              { name: 'PHY 201', score: 65, color: 'bg-red-500' }
            ].map((course, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{course.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{course.score}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${course.color}`} 
                    style={{ width: `${course.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLearningAnalytics;
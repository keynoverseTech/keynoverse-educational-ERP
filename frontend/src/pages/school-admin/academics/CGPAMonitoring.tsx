import { TrendingUp, Award, AlertTriangle, Search, Filter } from 'lucide-react';

const CGPAMonitoring = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-blue-600" />
            CGPA Monitoring
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track student academic performance and identify at-risk students.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <Award size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">Top 10%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">124</h3>
          <p className="text-gray-500 text-sm mt-1">First Class Students</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Avg: 3.42</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">2.85</h3>
          <p className="text-gray-500 text-sm mt-1">Average CGPA</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">Action Needed</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">45</h3>
          <p className="text-gray-500 text-sm mt-1">Students on Probation</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Performance Overview</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-12 text-center text-gray-500">
          <p>Select a level and program to view detailed CGPA analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default CGPAMonitoring;

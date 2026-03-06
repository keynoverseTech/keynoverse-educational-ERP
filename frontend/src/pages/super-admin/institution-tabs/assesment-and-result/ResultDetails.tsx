import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  Briefcase,
  Calendar,
  Landmark,
  ArrowLeft
} from 'lucide-react';

const ResultDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  // Get result data from navigation state or mock it
  const resultData = location.state?.result || {
    id: 'r1',
    examName: 'Quiz 1',
    course: 'History',
    faculty: 'Arts',
    department: 'History',
    publicationDate: '2024-03-01',
    status: 'Published',
    totalStudents: 120,
    passPercentage: '85%',
    averageScore: '78/100'
  };

  const getStatusColor = (status: string) => {
    if (status === 'Published') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
    if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Result Details</h1>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-green-500/40">
              {resultData.examName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-50 dark:border-gray-800">
              <div className={`w-4 h-4 rounded-full ${resultData.status === 'Published' ? 'bg-green-500 shadow-green-500/50' : resultData.status === 'Pending' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-lg`} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {resultData.examName}
              </h1>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(resultData.status)} shadow-sm`}>
                {resultData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Briefcase size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Course</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{resultData.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Publication Date</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{new Date(resultData.publicationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar pb-1">
        {['Details', 'Statistics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
            className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.toLowerCase().replace(' ', '-')
                ? 'bg-white dark:bg-gray-800 text-green-600 border-b-2 border-green-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'details' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-indigo-500" />
                Result Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Exam Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {resultData.examName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Course</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {resultData.course}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Publication Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {new Date(resultData.publicationDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Faculty</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {resultData.faculty}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Department</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {resultData.department}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(resultData.status)}`}>
                    <CheckCircle size={12} />
                    {resultData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Landmark size={20} className="text-orange-500" />
                Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Students</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{resultData.totalStudents}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pass Percentage</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{resultData.passPercentage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Average Score</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{resultData.averageScore}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Shield,
  CheckCircle,
  Briefcase,
  Calendar,
  Clock,
  ArrowLeft
} from 'lucide-react';

const ExamDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  // Get exam data from navigation state or mock it
  const examData = location.state?.exam || {
    id: '1',
    name: 'Mid-term Exam',
    course: 'Mathematics',
    faculty: 'Science',
    department: 'Mathematics',
    date: '2024-03-15',
    time: '10:00 AM',
    status: 'Upcoming',
    duration: '2 hours',
    venue: 'Hall A-101',
    invigilator: 'Dr. Alan Grant'
  };

  const getStatusColor = (status: string) => {
    if (status === 'Upcoming') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
    if (status === 'Ongoing') {
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Details</h1>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-purple-500/40">
              {examData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-50 dark:border-gray-800">
              <div className={`w-4 h-4 rounded-full ${examData.status === 'Upcoming' ? 'bg-blue-500 shadow-blue-500/50' : examData.status === 'Ongoing' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-green-500 shadow-green-500/50'} shadow-lg`} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {examData.name}
              </h1>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(examData.status)} shadow-sm`}>
                {examData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Briefcase size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Course</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{examData.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{new Date(examData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                  <Clock size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Time</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{examData.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar pb-1">
        {['Details', 'Venue & Invigilation'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
            className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.toLowerCase().replace(' ', '-')
                ? 'bg-white dark:bg-gray-800 text-purple-600 border-b-2 border-purple-600 shadow-sm'
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
                Exam Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Exam Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {examData.name}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Course</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {examData.course}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {new Date(examData.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Time</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {examData.time}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Duration</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {examData.duration}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Faculty</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {examData.faculty}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Department</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {examData.department}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(examData.status)}`}>
                    <CheckCircle size={12} />
                    {examData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'venue-&-invigilation' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-orange-500" />
                Venue & Invigilation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Venue</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{examData.venue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Invigilator</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{examData.invigilator}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;

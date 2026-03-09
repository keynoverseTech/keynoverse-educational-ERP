import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp,
  Search
} from 'lucide-react';

const ResearchDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      label: 'Active Projects', 
      value: 145, 
      trend: '+12 this term',
      icon: BookOpen, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      trendUp: true
    },
    { 
      label: 'Pending Topics', 
      value: 28, 
      trend: 'Needs review',
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trendUp: false
    },
    { 
      label: 'Plagiarism Alerts', 
      value: 5, 
      trend: 'High similarity',
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50 dark:bg-red-900/20',
      trendUp: false
    },
    { 
      label: 'Defenses Scheduled', 
      value: 12, 
      trend: 'Next 7 days',
      icon: Calendar, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      trendUp: true
    },
  ];

  const recentSubmissions = [
    { id: 1, student: 'John Doe', topic: 'AI in Healthcare', date: '2024-03-15', status: 'Submitted', type: 'Chapter 1' },
    { id: 2, student: 'Jane Smith', topic: 'Sustainable Energy', date: '2024-03-14', status: 'Pending Review', type: 'Proposal' },
    { id: 3, student: 'Michael Brown', topic: 'Blockchain Voting', date: '2024-03-13', status: 'Approved', type: 'Final Draft' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Research & Projects
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7" />
              Research Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Manage student research lifecycle, from topic approval to final defense.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="flex gap-2">
              <button 
                onClick={() => navigate('/school-admin/academics/research/topics')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border border-white/20"
              >
                Approve Topics
              </button>
              <button 
                onClick={() => navigate('/school-admin/academics/research/defense')}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg"
              >
                Schedule Defense
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
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Submissions</h3>
            <button 
              onClick={() => navigate('/school-admin/academics/research/submissions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{sub.topic}</p>
                    <p className="text-xs text-gray-500">{sub.student} • {sub.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    sub.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    sub.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {sub.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{sub.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Management</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/school-admin/academics/research/supervisors')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-500 group-hover:text-blue-600" />
                <span className="font-medium text-sm">Manage Supervisors</span>
              </div>
              <TrendingUp size={16} className="text-gray-400 group-hover:text-blue-600" />
            </button>
            
            <button 
              onClick={() => navigate('/school-admin/academics/research/plagiarism')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-gray-500 group-hover:text-red-600" />
                <span className="font-medium text-sm">Plagiarism Check</span>
              </div>
              <TrendingUp size={16} className="text-gray-400 group-hover:text-red-600" />
            </button>

            <button 
              onClick={() => navigate('/school-admin/academics/research/archive')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search size={18} className="text-gray-500 group-hover:text-purple-600" />
                <span className="font-medium text-sm">Project Archive</span>
              </div>
              <TrendingUp size={16} className="text-gray-400 group-hover:text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchDashboard;

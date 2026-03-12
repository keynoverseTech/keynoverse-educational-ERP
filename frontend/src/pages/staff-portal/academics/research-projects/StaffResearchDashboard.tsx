import { useNavigate } from 'react-router-dom';
import { 
  Users,
  FileText,
  CheckCircle,
  Search,
  Calendar,
  Clock
} from 'lucide-react';

const StaffResearchDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      label: 'Assigned Students', 
      value: 12, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'Pending Reviews', 
      value: 4, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    { 
      label: 'Completed Projects', 
      value: 8, 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: 'Upcoming Defenses', 
      value: 2, 
      icon: Calendar, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const pendingReviews = [
    { id: 1, student: 'John Doe', topic: 'AI in Healthcare', type: 'Chapter 2', date: '2024-03-15' },
    { id: 2, student: 'Jane Smith', topic: 'Sustainable Energy', type: 'Proposal', date: '2024-03-14' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl px-6 py-8 shadow-lg shadow-blue-600/20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Research Supervision</h1>
            <p className="text-blue-100 max-w-xl">
              Manage your assigned students, review project submissions, and track research progress efficiently.
            </p>
          </div>
          <button 
            onClick={() => navigate('/staff/academics/research/submissions')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2"
          >
            <FileText size={18} />
            Submissions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Reviews</h3>
            <button 
              onClick={() => navigate('/staff/academics/research/submissions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{review.topic}</p>
                    <p className="text-sm text-gray-500">{review.student} • {review.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => navigate('/staff/academics/research/submissions')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Review
                  </button>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/staff/academics/research/students')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-500 group-hover:text-blue-600" />
                <span className="font-medium text-sm">View Assigned Students</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/staff/academics/research/submissions')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-500 group-hover:text-amber-600" />
                <span className="font-medium text-sm">Review Submissions</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/staff/academics/research/plagiarism')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search size={18} className="text-gray-500 group-hover:text-purple-600" />
                <span className="font-medium text-sm">Plagiarism Check</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffResearchDashboard;

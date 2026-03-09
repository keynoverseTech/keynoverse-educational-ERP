import { 
  BookOpen, 
  FileText, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResearchDashboard = () => {
  const navigate = useNavigate();

  // Mock data for project status
  const projectStatus = {
    topic: 'Approved',
    supervisor: 'Dr. Musa Ibrahim',
    submissionStage: 'Chapter 2 Pending',
    nextDeadline: '2024-05-15'
  };

  const progressSteps = [
    { id: 1, label: 'Topic Proposal', status: 'completed', date: '2024-01-10' },
    { id: 2, label: 'Supervisor Assignment', status: 'completed', date: '2024-01-15' },
    { id: 3, label: 'Draft Submission', status: 'in_progress', date: 'Current' },
    { id: 4, label: 'Final Submission', status: 'pending', date: '-' },
    { id: 5, label: 'Defense', status: 'pending', date: '-' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research & Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your final year project and research work</p>
        </div>
        <button 
          onClick={() => navigate('/student/academics/research/proposal')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <FileText size={16} />
          New Topic Proposal
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Project Timeline</h3>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 flex justify-between">
            {progressSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                  step.status === 'completed' 
                    ? 'bg-green-500 border-green-100 dark:border-green-900 text-white' 
                    : step.status === 'in_progress'
                    ? 'bg-blue-500 border-blue-100 dark:border-blue-900 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                }`}>
                  {step.status === 'completed' ? <CheckCircle size={20} /> : <span className="font-bold">{step.id}</span>}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${
                    step.status === 'completed' || step.status === 'in_progress'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500'
                  }`}>{step.label}</p>
                  <p className="text-[10px] text-gray-400">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Topic Status */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg">Topic Status</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{projectStatus.topic}</div>
            <p className="text-blue-100 text-sm flex items-center gap-1">
              <CheckCircle size={14} />
              View Details
            </p>
          </div>
        </div>

        {/* Supervisor */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg">Supervisor</h3>
            </div>
            <div className="text-xl font-bold mb-1 truncate">{projectStatus.supervisor}</div>
            <p className="text-emerald-100 text-sm flex items-center gap-1">
              <ArrowRight size={14} />
              Contact Info
            </p>
          </div>
        </div>

        {/* Submission Stage */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg">Stage</h3>
            </div>
            <div className="text-xl font-bold mb-1">{projectStatus.submissionStage}</div>
            <p className="text-purple-100 text-sm flex items-center gap-1">
              <Clock size={14} />
              In Progress
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg">Deadline</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{projectStatus.nextDeadline}</div>
            <p className="text-orange-100 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              Upcoming
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/student/academics/research/project')}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">My Project</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View project details & timeline</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/student/academics/research/submissions')}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Submissions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload drafts & final copies</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/student/academics/research/feedback')}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Supervisor Feedback</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View comments & reviews</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/student/academics/research/plagiarism')}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Plagiarism Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check similarity scores</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/student/academics/research/defense')}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Defense Schedule</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View date, time & venue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchDashboard;

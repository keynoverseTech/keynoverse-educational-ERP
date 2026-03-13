import { 
  BookOpen, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MyProject from './MyProject';

const ResearchDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'project' ? 'project' : 'dashboard';

  // Mock data for project status
  const projectStatus = {
    topic: 'Approved',
    supervisor: 'Dr. Musa Ibrahim',
    submissionStage: 'Chapter 2 Pending',
    nextDeadline: '2024-05-15'
  };

  const setTab = (tab: 'dashboard' | 'project') => {
    if (tab === 'project') setSearchParams({ tab: 'project' });
    else setSearchParams({});
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Research & projects overview</p>
        </div>
        <button 
          onClick={() => navigate('/student/academics/research/proposal')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <FileText size={16} />
          New Topic Proposal
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab('project')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'project'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            My Project
          </button>
        </div>
      </div>

      {activeTab === 'project' ? (
        <MyProject embedded />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <ArrowRight size={14} />
                  View
                </p>
              </div>
            </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => setTab('project')}
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
                  <h3 className="font-bold text-gray-900 dark:text-white">Project Submissions</h3>
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
                  <h3 className="font-bold text-gray-900 dark:text-white">Defence Scheduling</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View date, time & venue</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResearchDashboard;

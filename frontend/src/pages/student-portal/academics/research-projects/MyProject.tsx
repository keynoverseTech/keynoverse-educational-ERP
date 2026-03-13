import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProject = ({ embedded }: { embedded?: boolean }) => {
  const navigate = useNavigate();

  const projectDetails = {
    title: "Design and Implementation of a Student Portal with LMS Integration",
    description: "This project aims to develop a comprehensive student portal that integrates a Learning Management System (LMS) to facilitate seamless academic activities. The system will include modules for course registration, assignment submission, result checking, and real-time communication between students and lecturers.",
    supervisor: {
      name: "Dr. Musa Ibrahim",
      department: "Computer Science",
      email: "m.ibrahim@university.edu.ng",
      phone: "+234 800 123 4567",
      office: "Block B, Room 304"
    },
    timeline: [
      { stage: "Topic Proposal", date: "Jan 10, 2024", status: "completed" },
      { stage: "Chapter 1", date: "Feb 05, 2024", status: "completed" },
      { stage: "Chapter 2", date: "Mar 01, 2024", status: "completed" },
      { stage: "Chapter 3", date: "Apr 15, 2024", status: "in_progress" },
      { stage: "Final Defense", date: "Jun 20, 2024", status: "pending" },
    ]
  };

  return (
    <div className={`${embedded ? '' : 'p-6 '}space-y-6`}>
      {!embedded && (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Project</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Project details and supervisor information</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Project Title</label>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{projectDetails.title}</h2>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {projectDetails.description}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">Project Timeline</label>
                <div className="space-y-4">
                  {projectDetails.timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        item.status === 'completed' 
                          ? 'bg-green-100 border-green-500 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : item.status === 'in_progress'
                          ? 'bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600'
                      }`}>
                        {item.status === 'completed' ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className={`font-medium ${
                            item.status === 'completed' || item.status === 'in_progress' 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {item.stage}
                          </span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Assigned Supervisor</h3>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <User size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{projectDetails.supervisor.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{projectDetails.supervisor.department}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Mail size={16} className="text-gray-400" />
                <span>{projectDetails.supervisor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Phone size={16} className="text-gray-400" />
                <span>{projectDetails.supervisor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="text-gray-400" />
                <span>{projectDetails.supervisor.office}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              Send Message
            </button>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
             <div className="flex items-start gap-3">
               <Calendar className="text-indigo-600 dark:text-indigo-400 mt-1" size={20} />
               <div>
                 <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">Next Meeting</h4>
                 <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                   Weekly project review
                 </p>
                 <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mt-2">
                   Thursday, 10:00 AM
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProject;

import { 
  User, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Reply
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupervisorFeedback = () => {
  const navigate = useNavigate();

  const feedbackThreads = [
    {
      id: 1,
      submission: "Chapter 2 - Literature Review (v1.0)",
      date: "2024-03-02",
      status: "revision_required",
      supervisor: {
        name: "Dr. Musa Ibrahim",
        avatar: "MI"
      },
      messages: [
        {
          sender: "supervisor",
          text: "I've reviewed your Chapter 2. The content is generally good, but you need to include more recent citations from the last 5 years. Also, the section on 'Related Works' needs to be more critical, not just descriptive.",
          time: "10:30 AM"
        },
        {
          sender: "student",
          text: "Thank you Dr. I will update the citations and revise the Related Works section. Should I focus on any specific journals?",
          time: "11:15 AM"
        },
        {
          sender: "supervisor",
          text: "Yes, look at IEEE Transactions and recent conference proceedings on the topic.",
          time: "02:00 PM"
        }
      ]
    },
    {
      id: 2,
      submission: "Chapter 1 - Introduction (v1.0)",
      date: "2024-02-06",
      status: "approved",
      supervisor: {
        name: "Dr. Musa Ibrahim",
        avatar: "MI"
      },
      messages: [
        {
          sender: "supervisor",
          text: "Excellent introduction. The problem statement is clear and the objectives are well-defined. You can proceed to Chapter 2.",
          time: "09:00 AM"
        }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supervisor Feedback</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review comments and discussions</p>
        </div>
      </div>

      <div className="space-y-6">
        {feedbackThreads.map((thread) => (
          <div key={thread.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">
                    {thread.submission}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">{thread.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {thread.status === 'approved' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <CheckCircle size={14} /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                    <AlertCircle size={14} /> Revision Required
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/10">
              {thread.messages.map((msg, index) => (
                <div key={index} className={`flex gap-4 ${msg.sender === 'student' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'student' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300'
                  }`}>
                    {msg.sender === 'student' ? <User size={20} /> : <span className="font-bold text-xs">{thread.supervisor.avatar}</span>}
                  </div>
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'student'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-600'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 text-right ${
                      msg.sender === 'student' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your reply..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Reply size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorFeedback;

import { 
  User, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Reply
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { appendFeedbackMessage, getStudentFeedbackThreads, type FeedbackThreadStatus } from '../../../../utils/researchSupervisorFeedback';

const SupervisorFeedback = () => {
  const navigate = useNavigate();

  const studentMatric = useMemo(() => {
    const proposalRaw = localStorage.getItem('student_research_topic_proposal');
    if (proposalRaw) {
      try {
        const parsed = JSON.parse(proposalRaw) as { student?: { matricNumber?: string } };
        if (parsed?.student?.matricNumber) return parsed.student.matricNumber;
      } catch {
        return 'CS/2020/001';
      }
    }
    return 'CS/2020/001';
  }, []);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  const feedbackThreads = useMemo(() => getStudentFeedbackThreads(studentMatric), [studentMatric, tick]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const setDraft = (threadId: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [threadId]: value }));
  };

  const sendReply = (threadId: string, currentStatus: FeedbackThreadStatus) => {
    const text = (drafts[threadId] ?? '').trim();
    if (!text) return;
    appendFeedbackMessage({
      studentMatric,
      threadId,
      sender: 'student',
      text,
      nextStatus: currentStatus
    });
    setDrafts((prev) => ({ ...prev, [threadId]: '' }));
    setTick((n) => n + 1);
  };

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
        {feedbackThreads.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
            <div className="text-sm font-black text-gray-900 dark:text-white">No feedback yet</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">When your supervisor reviews a submission, it will appear here.</div>
          </div>
        )}
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
                ) : thread.status === 'rejected' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                    <AlertCircle size={14} /> Rejected
                  </span>
                ) : thread.status === 'revision_required' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                    <AlertCircle size={14} /> Revision Required
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    <AlertCircle size={14} /> Under Review
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
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  value={drafts[String(thread.id)] ?? ''}
                  onChange={(e) => setDraft(String(thread.id), e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendReply(String(thread.id), thread.status);
                  }}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={() => sendReply(String(thread.id), thread.status)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
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

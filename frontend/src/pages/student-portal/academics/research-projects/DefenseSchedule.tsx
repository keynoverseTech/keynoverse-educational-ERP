import { Calendar, Clock, Eye, MapPin, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

const DefenseSchedule = () => {
  const navigate = useNavigate();

  type DefenseStatus = 'Scheduled' | 'Completed' | 'Cancelled';
  type DefenseSession = {
    id: string;
    faculty: string;
    department: string;
    programme: string;
    students: Array<{ name: string; matric: string; projectTitle: string }>;
    date: string;
    time: string;
    venue: string;
    panel: string[];
    status: DefenseStatus;
    createdAt: string;
  };

  const STORAGE_KEY = 'school_admin_research_defense_schedule';

  const currentStudentMatric = useMemo(() => {
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

  const sessions = useMemo(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [] as DefenseSession[];
    try {
      return JSON.parse(raw) as DefenseSession[];
    } catch {
      return [] as DefenseSession[];
    }
  }, []);

  const mySessions = useMemo(() => {
    return sessions
      .filter((s) => s.students.some((st) => st.matric === currentStudentMatric))
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
  }, [currentStudentMatric, sessions]);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const selectedSession = useMemo(() => mySessions.find((s) => s.id === selectedSessionId) ?? null, [mySessions, selectedSessionId]);
  const myEntry = useMemo(() => {
    if (!selectedSession) return null;
    return selectedSession.students.find((st) => st.matric === currentStudentMatric) ?? null;
  }, [currentStudentMatric, selectedSession]);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Defence Scheduling</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming project defence details</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {mySessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400 mb-4">
              <Calendar size={28} />
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">No defense scheduled yet</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">You will receive a notification once your defense is scheduled.</div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-black text-gray-900 dark:text-white">My Defense Sessions</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sessions scheduled by the School Admin.</div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {mySessions.map((s) => {
                const entry = s.students.find((st) => st.matric === currentStudentMatric);
                return (
                  <div key={s.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                          <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                          {s.date}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Clock size={16} className="text-gray-400" />
                          {s.time}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin size={16} className="text-gray-400" />
                          {s.venue}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-bold text-gray-900 dark:text-white truncate">
                        {entry?.projectTitle ?? 'Project'}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {s.department} • {s.programme}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSessionId(s.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedSession && myEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Defense Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{myEntry.projectTitle}</p>
              </div>
              <button onClick={() => setSelectedSessionId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Date & Time</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedSession.date}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{selectedSession.time}</div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Venue</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedSession.venue}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{selectedSession.faculty}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Panel Members</div>
                <div className="space-y-2">
                  {selectedSession.panel.map((name) => (
                    <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold">
                        {name.charAt(0)}
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Session Participants</div>
                <div className="space-y-2">
                  {selectedSession.students.map((st) => (
                    <div
                      key={st.matric}
                      className={`p-3 rounded-xl border ${
                        st.matric === currentStudentMatric
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                      }`}
                    >
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{st.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{st.matric}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{st.projectTitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
              <button
                onClick={() => setSelectedSessionId(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefenseSchedule;

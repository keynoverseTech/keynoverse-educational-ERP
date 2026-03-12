import { useMemo, useState } from 'react';
import { Calendar, Clock, Eye, MapPin, X } from 'lucide-react';
import { useAuth } from '../../../../state/authContext';

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

const loadDefenseSessions = (): DefenseSession[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DefenseSession[];
  } catch {
    return [];
  }
};

const StaffDefenseSchedule = () => {
  const { user } = useAuth();
  const currentStaffName = user?.name || 'Dr. Sarah';

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const sessions = useMemo(() => loadDefenseSessions(), []);

  const relevantSessions = useMemo(() => {
    return sessions
      .filter((s) => s.panel.includes(currentStaffName))
      .sort((a, b) => {
        const aTime = new Date(`${a.date} ${a.time}`).getTime();
        const bTime = new Date(`${b.date} ${b.time}`).getTime();
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return aTime - bTime;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [currentStaffName, sessions]);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return relevantSessions.find((s) => s.id === selectedSessionId) ?? null;
  }, [relevantSessions, selectedSessionId]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-orange-600" />
            Defense Schedule
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View upcoming defenses where you are assigned as a panel member.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {relevantSessions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {s.students.length === 1 ? s.students[0].name : `${s.students.length} Students`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-sm">
                    {s.students.slice(0, 2).map((st) => st.name).join(', ')}
                    {s.students.length > 2 ? ` +${s.students.length - 2} more` : ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="font-bold text-gray-900 dark:text-white">{s.department}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{s.programme}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="font-bold text-gray-900 dark:text-white">{s.date}</span>
                    <span className="text-gray-400">•</span>
                    <span>{s.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{s.venue}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedSessionId(s.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {relevantSessions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-gray-400 italic">
                  No defense schedule found for you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Defense Schedule Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSession.department} • {selectedSession.programme}
                </p>
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
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Students</div>
                <div className="space-y-3">
                  {selectedSession.students.map((st) => (
                    <div key={st.matric} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{st.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{st.matric}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 truncate">{st.projectTitle}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Panel Members</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.panel.map((name) => (
                    <span
                      key={name}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        name === currentStaffName
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-200'
                      }`}
                    >
                      {name}
                    </span>
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

export default StaffDefenseSchedule;

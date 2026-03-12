import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  AlertCircle, 
  Plus, 
  Calendar,
  ClipboardList,
  HelpCircle,
  Folder,
  Book
} from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

type StoredCourseContent = Record<string, { id: number; title: string; description: string; items: { id: number; title: string; type: string; size: string; date: string; allowDownload: boolean }[] }[]>;

const CONTENT_KEY = 'staff_lms_course_content';
const ASSIGNMENTS_KEY = 'staff_lms_assignments';
const QUIZZES_KEY = 'staff_lms_quizzes';

const loadJson = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const toDate = (value: string) => {
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  const d2 = new Date(`${value}T00:00:00`);
  return d2;
};

const timeAgo = (value: string) => {
  const d = toDate(value);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const StaffLMSDashboard = () => {
  const navigate = useNavigate();
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [assignmentsCount, setAssignmentsCount] = useState<number>(0);
  const [quizzesCount, setQuizzesCount] = useState<number>(0);
  const [materialsCount, setMaterialsCount] = useState<number>(0);
  const [recentUpdates, setRecentUpdates] = useState<{ id: string; courseCode: string; title: string; time: string; kind: 'material' | 'assignment' | 'quiz' }[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<{ id: string; title: string; courseCode: string; dueAt: string }[]>([]);

  useEffect(() => {
    const allowed = new Set(assignedCourses.map(c => c.code));
    const assignments = loadJson<any[]>(ASSIGNMENTS_KEY, []);
    const filteredAssignments = assignments
      .filter(a => allowed.has(a.courseCode))
      .filter(a => selectedCourse === 'All' ? true : a.courseCode === selectedCourse);
    setAssignmentsCount(filteredAssignments.length);

    const quizzes = loadJson<any[]>(QUIZZES_KEY, []);
    const filteredQuizzes = quizzes
      .filter(q => allowed.has(q.courseCode))
      .filter(q => selectedCourse === 'All' ? true : q.courseCode === selectedCourse);
    setQuizzesCount(filteredQuizzes.length);

    const contentByCourse = loadJson<StoredCourseContent>(CONTENT_KEY, {});
    const courseCodes = selectedCourse === 'All' ? Array.from(allowed) : [selectedCourse];
    const allItems = courseCodes.flatMap(code => (contentByCourse[code] ?? []).flatMap(m => m.items ?? []));
    setMaterialsCount(allItems.length);

    const materialUpdates = courseCodes.flatMap(code => (contentByCourse[code] ?? []).flatMap(m => (m.items ?? []).map(i => ({
      id: `m-${code}-${i.id}`,
      courseCode: code,
      title: i.title,
      time: timeAgo(i.date),
      kind: 'material' as const,
      createdAt: i.date
    }))));

    const assignmentUpdates = filteredAssignments.map(a => ({
      id: `a-${a.id ?? a.createdAt ?? Math.random()}`,
      courseCode: a.courseCode,
      title: a.title ?? 'New Assignment',
      time: timeAgo(a.createdAt ?? a.dueDate ?? new Date().toISOString()),
      kind: 'assignment' as const,
      createdAt: a.createdAt ?? a.dueDate ?? new Date().toISOString()
    }));

    const quizUpdates = filteredQuizzes.map(q => ({
      id: `q-${q.id ?? q.createdAt ?? Math.random()}`,
      courseCode: q.courseCode,
      title: q.title ?? 'New Quiz',
      time: timeAgo(q.createdAt ?? q.startDateTime ?? new Date().toISOString()),
      kind: 'quiz' as const,
      createdAt: q.createdAt ?? q.startDateTime ?? new Date().toISOString()
    }));

    const merged = [...materialUpdates, ...assignmentUpdates, ...quizUpdates]
      .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
      .slice(0, 5)
      .map(({ createdAt, ...rest }) => rest);
    setRecentUpdates(merged);

    const deadlines = filteredAssignments
      .map(a => ({
        id: String(a.id ?? a.createdAt ?? Math.random()),
        title: a.title ?? 'Assignment',
        courseCode: a.courseCode,
        dueAt: `${a.dueDate ?? ''}${a.dueTime ? `T${a.dueTime}` : ''}`
      }))
      .filter(d => d.dueAt)
      .sort((a, b) => toDate(a.dueAt).getTime() - toDate(b.dueAt).getTime())
      .slice(0, 3);
    setUpcomingDeadlines(deadlines);
  }, [assignedCourses, selectedCourse]);

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Learning Management System
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7" />
              LMS Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-2xl">
              Manage course materials, assignments, quizzes, and track submissions for your assigned courses.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3 text-blue-50/90">
            <div className="relative min-w-[280px] w-full lg:w-[320px]">
              <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={16} />
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              >
                <option value="All" className="text-gray-900">All My Courses</option>
                {assignedCourses.map(c => (
                  <option key={c.id} value={c.code} className="text-gray-900">{c.code} - {c.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate('/staff/lms/assignments')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-2"
              >
                <Plus size={16} /> Create Assignment
              </button>
              <button
                onClick={() => navigate('/staff/lms/content')}
                className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2"
              >
                <Plus size={16} /> Upload Material
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="absolute inset-x-0 top-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Courses</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{assignedCourses.length}</h3>
              <p className="text-xs text-gray-400 mt-1">Active</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Materials</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{materialsCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Documents uploaded</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <Folder size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignments</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{assignmentsCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Created</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <ClipboardList size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="absolute inset-x-0 top-0 h-1 bg-purple-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quizzes</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{quizzesCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Created</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <HelpCircle size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Updates</h3>
          <div className="space-y-4">
            {recentUpdates.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    u.kind === 'material'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                      : u.kind === 'assignment'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  }`}>
                    {u.kind === 'material' ? <FileText size={20} /> : u.kind === 'assignment' ? <Clock size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{u.courseCode}</p>
                    <p className="text-xs text-gray-500">{u.title}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{u.time}</span>
              </div>
            ))}
            {recentUpdates.length === 0 && (
              <div className="text-center py-10 text-gray-500">No recent activity yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((d, idx) => (
              <div key={d.id} className={`flex items-start gap-3 pb-4 ${idx === upcomingDeadlines.length - 1 ? '' : 'border-b border-gray-100 dark:border-gray-700'}`}>
                <div className="bg-red-50 text-red-600 p-2 rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{d.title}</p>
                  <p className="text-xs text-gray-500">{d.courseCode} • Due {new Date(d.dueAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-10 text-gray-500">No upcoming deadlines.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLMSDashboard;

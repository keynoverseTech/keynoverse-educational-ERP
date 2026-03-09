import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle, Clock, Filter, X, Save, Book } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

type SubmissionStatus = 'Submitted' | 'Late' | 'Missing' | 'Graded';

interface Submission {
  id: string;
  student: string;
  matric: string;
  assignmentTitle: string;
  courseCode: string;
  date: string;
  status: SubmissionStatus;
  grade: string;
}

const GRADES_KEY = 'staff_lms_grades';

const loadGrades = (): Record<string, string> => {
  const raw = localStorage.getItem(GRADES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const saveGrades = (data: Record<string, string>) => {
  localStorage.setItem(GRADES_KEY, JSON.stringify(data));
};

const StaffSubmissions: React.FC = () => {
  const assigned = useMemo(() => getAssignedCourses(), []);
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [newGrade, setNewGrade] = useState('');
  const [grades, setGrades] = useState<Record<string, string>>({});

  const allowed = useMemo(() => new Set(assigned.map(c => c.code)), [assigned]);

  const baseSubmissions: Submission[] = [
    { id: '1', student: 'John Doe', matric: 'SCI/20/001', assignmentTitle: 'Project Charter Submission', courseCode: assigned[0]?.code || 'CSC 401', date: '2024-03-24', status: 'Submitted', grade: '-' },
    { id: '2', student: 'Jane Smith', matric: 'SCI/20/002', assignmentTitle: 'Project Charter Submission', courseCode: assigned[0]?.code || 'CSC 401', date: '2024-03-24', status: 'Submitted', grade: '-' },
    { id: '3', student: 'Michael Brown', matric: 'SCI/20/022', assignmentTitle: 'Vector Spaces', courseCode: assigned[1]?.code || 'MTH 302', date: '-', status: 'Missing', grade: '-' }
  ];

  useEffect(() => {
    setGrades(loadGrades());
  }, []);

  useEffect(() => {
    saveGrades(grades);
  }, [grades]);

  const submissions = useMemo(() => {
    const inScope = baseSubmissions.filter(s => allowed.has(s.courseCode));
    const list = selectedCourse === 'All' ? inScope : inScope.filter(s => s.courseCode === selectedCourse);
    return list.map(s => ({ ...s, grade: grades[s.id] || s.grade }));
  }, [allowed, baseSubmissions, selectedCourse, grades]);

  const openGrade = (s: Submission) => {
    setSelectedSubmission(s);
    setNewGrade(grades[s.id] || '');
    setIsGradeOpen(true);
  };

  const saveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setGrades(prev => ({ ...prev, [selectedSubmission.id]: newGrade || '-' }));
    setIsGradeOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-emerald-600" />
            Submissions & Grading
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Review and grade student submissions for your assigned courses.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <Filter size={16} className="text-gray-400" />
        <div className="relative w-72">
          <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All My Courses</option>
            {assigned.map(c => (
              <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Matric</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Assignment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Grade</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {submissions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{s.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.matric}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.assignmentTitle}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold">{s.courseCode}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    s.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                    s.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                    s.status === 'Graded' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {s.status === 'Submitted' && <CheckCircle size={12} />}
                    {s.status === 'Late' && <Clock size={12} />}
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{s.grade}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openGrade(s)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isGradeOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Grade Submission</h2>
              <button onClick={() => setIsGradeOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={saveGrade} className="p-6 space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedSubmission.assignmentTitle}</p>
                <p className="text-xs text-gray-500">{selectedSubmission.student} • {selectedSubmission.matric}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score</label>
                <input
                  type="text"
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value)}
                  placeholder="e.g. 18/20"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsGradeOpen(false)}
                  className="px-6 py-2 mr-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSubmissions;


import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, BookOpen, ClipboardList, HelpCircle, BarChart2, Book } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

const StaffLMSDashboard: React.FC = () => {
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);

  useEffect(() => {
    const allowed = new Set(assignedCourses.map(c => c.code));
    const assignmentsRaw = localStorage.getItem('staff_lms_assignments');
    const assignments = assignmentsRaw ? JSON.parse(assignmentsRaw) : [];
    const filteredAssignments = (assignments as any[]).filter(a => allowed.has(a.courseCode)).filter(a => selectedCourse === 'All' ? true : a.courseCode === selectedCourse);
    setAssignmentsCount(filteredAssignments.length);
    const quizzesRaw = localStorage.getItem('staff_lms_quizzes');
    const quizzes = quizzesRaw ? JSON.parse(quizzesRaw) : [];
    const filteredQuizzes = (quizzes as any[]).filter(q => allowed.has(q.courseCode)).filter(q => selectedCourse === 'All' ? true : q.courseCode === selectedCourse);
    setQuizzesCount(filteredQuizzes.length);
  }, [assignedCourses, selectedCourse]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            LMS Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of your teaching resources and assessments.</p>
        </div>
        <div className="relative min-w-[260px]">
          <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="All">All My Courses</option>
            {assignedCourses.map(c => (
              <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
              <ClipboardList size={24} />
            </div>
            <span className="text-xs font-bold text-gray-500">Assessments</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-4">{assignmentsCount}</h3>
          <p className="text-xs text-gray-500 mt-1">Assignments</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600">
              <HelpCircle size={24} />
            </div>
            <span className="text-xs font-bold text-gray-500">Assessments</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-4">{quizzesCount}</h3>
          <p className="text-xs text-gray-500 mt-1">Quizzes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} /> My Courses
            </h3>
            <span className="text-xs text-gray-500">{assignedCourses.length} courses</span>
          </div>
          <div className="space-y-3">
            {assignedCourses.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{c.code}</p>
                  <p className="text-xs text-gray-500">{c.title}</p>
                </div>
              </div>
            ))}
            {assignedCourses.length === 0 && (
              <div className="text-center py-10 text-gray-500">No assigned courses.</div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} /> Quick Links
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a href="/staff/lms/assignments" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold flex items-center gap-2">
              <ClipboardList size={16} /> Assignments
            </a>
            <a href="/staff/lms/quizzes" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold flex items-center gap-2">
              <HelpCircle size={16} /> Quizzes
            </a>
            <a href="/staff/lms/submissions" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold flex items-center gap-2">
              <BookOpen size={16} /> Submissions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLMSDashboard;

import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { getAssignedCourses } from './assignedCourses';

type StudentRow = {
  id: string;
  name: string;
  matric: string;
  level: string;
  courseCode: string;
};

const buildStudents = (courseCode: string, level: string): StudentRow[] => {
  const baseNames = [
    'Amina Yusuf', 'David West', 'Chinedu Okafor', 'Fatima Bello', 'Samuel Adeyemi',
    'Grace Nwosu', 'Ibrahim Musa', 'Zainab Ali', 'Esther Johnson', 'Emeka Nnamdi',
    'Hauwa Sule', 'Peter Okon', 'Maryam Danjuma', 'Joseph Eze', 'Kelechi Umeh',
    'Sani Abdullahi', 'Rita Ojo', 'Tunde Akin', 'Hadiza Garba', 'Solomon Obi',
    'Khadijah Idris', 'Michael Brown', 'Ngozi Ekwueme', 'Bola Adebayo', 'Abubakar Sadiq',
  ];
  return baseNames.map((name, idx) => ({
    id: `${courseCode}-${idx + 1}`,
    name,
    matric: `ST/${courseCode}/${String(idx + 1).padStart(3, '0')}`,
    level,
    courseCode,
  }));
};

const Students: React.FC = () => {
  const location = useLocation();
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const initialCourse = (location.state as any)?.courseId || 'All';
  const [courseFilter, setCourseFilter] = useState<string>(initialCourse);
  const [searchTerm, setSearchTerm] = useState('');

  const students = useMemo(() => {
    const selected = courseFilter === 'All' ? assignedCourses : assignedCourses.filter(c => c.code === courseFilter);
    return selected.flatMap(c => buildStudents(c.code, c.levelId.replace('lvl-', '') + ' Level'));
  }, [assignedCourses, courseFilter]);

  const filtered = useMemo(() => {
    if (!searchTerm) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(term) || s.matric.toLowerCase().includes(term));
  }, [students, searchTerm]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Students assigned to your courses</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
            <option value="All">All Courses</option>
            {assignedCourses.map(c => (
              <option key={c.id} value={c.code}>{c.code}</option>
            ))}
          </select>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Matric No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {s.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{s.matric}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.level}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-900/40 rounded-lg">
                      <Users size={14} className="text-gray-400" />
                      {s.courseCode}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;


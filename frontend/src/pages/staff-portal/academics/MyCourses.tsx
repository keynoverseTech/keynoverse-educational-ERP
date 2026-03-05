import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Users, ClipboardCheck, Calendar } from 'lucide-react';
import { getAssignedCourses } from './assignedCourses';

const semesterLabel = (semesterId: string) => {
  if (semesterId === 'sem-1') return 'First Semester';
  if (semesterId === 'sem-2') return 'Second Semester';
  return semesterId;
};

const typeLabel = (type: string) => {
  if (type === 'core') return 'Core';
  if (type === 'elective') return 'Elective';
  return 'General';
};

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const courses = useMemo(() => getAssignedCourses(), []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Courses assigned to you for teaching</p>
        </div>
        <button
          onClick={() => navigate('/staff/academics/materials')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <FileText size={16} /> Upload Materials
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 font-bold text-xs">
                        {c.code}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.levelId.replace('lvl-', '')} Level</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {semesterLabel(c.semesterId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {c.creditUnits}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      c.type === 'core' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      c.type === 'elective' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {typeLabel(c.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('/staff/academics/materials', { state: { courseId: c.code } })}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Course Materials"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => navigate('/staff/academics/students', { state: { courseId: c.code } })}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Students"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => navigate('/staff/academics/attendance')}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title="Attendance"
                      >
                        <ClipboardCheck size={18} />
                      </button>
                      <button
                        onClick={() => navigate('/staff/academics/timetable')}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        title="Timetable"
                      >
                        <Calendar size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500">
                    No courses have been assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;


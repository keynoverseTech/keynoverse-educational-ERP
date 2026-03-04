import React, { useMemo, useState } from 'react';
import { BarChart3, Users, Filter, Search } from 'lucide-react';
import { useAttendance } from '../../../../state/academics/attendanceContext';

type StudentAggregate = {
  studentId: string;
  studentName: string;
  studentMatric: string;
  present: number;
  total: number;
  rate: number;
};

const AttendanceReport: React.FC = () => {
  const { sessions } = useAttendance();
  const [searchStudent, setSearchStudent] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterCourse, setFilterCourse] = useState('All');
  const [threshold, setThreshold] = useState(5);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(sessions.map(s => s.department).filter(Boolean)))],
    [sessions]
  );
  const courses = useMemo(
    () => ['All', ...Array.from(new Set(sessions.map(s => `${s.courseCode} — ${s.courseTitle}`)))],
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const deptOk = filterDepartment === 'All' ? true : s.department === filterDepartment;
      const courseLabel = `${s.courseCode} — ${s.courseTitle}`;
      const courseOk = filterCourse === 'All' ? true : courseLabel === filterCourse;
      return deptOk && courseOk;
    });
  }, [sessions, filterDepartment, filterCourse]);

  const aggregates: StudentAggregate[] = useMemo(() => {
    const map = new Map<string, StudentAggregate>();
    for (const s of filteredSessions) {
      for (const r of s.records) {
        const key = r.studentId;
        const current = map.get(key) || {
          studentId: r.studentId,
          studentName: r.studentName,
          studentMatric: r.studentMatric,
          present: 0,
          total: 0,
          rate: 0
        };
        current.total += 1;
        if (r.status === 'Present') current.present += 1;
        map.set(key, current);
      }
    }
    const arr = Array.from(map.values()).map(a => ({
      ...a,
      rate: a.total > 0 ? Math.round((a.present / a.total) * 100) : 0
    }));
    return arr
      .filter(a =>
        `${a.studentName} ${a.studentMatric}`.toLowerCase().includes(searchStudent.toLowerCase())
      )
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [filteredSessions, searchStudent]);

  const totalSessions = filteredSessions.length;
  const avgAttendance =
    aggregates.length > 0
      ? Math.round(
          (aggregates.reduce((acc, a) => acc + a.rate, 0) / aggregates.length) * 10
        ) / 10
      : 0;
  const belowThreshold = aggregates.filter(a => a.present < threshold).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Report</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive summary across sessions with flexible filters
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search student by name or matric no..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchStudent}
            onChange={e => setSearchStudent(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
          >
            {departments.map(d => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
          >
            {courses.map(c => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Courses' : c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">Threshold</label>
          <input
            type="number"
            min={0}
            className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={threshold}
            onChange={e => setThreshold(parseInt(e.target.value || '0', 10))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Attendance</p>
            <p className="text-2xl font-bold">{avgAttendance}%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Below {threshold} Present</p>
            <p className="text-2xl font-bold">{belowThreshold}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Matric</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Present</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {aggregates.map(a => (
                <tr key={a.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{a.studentName}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300 font-mono text-sm">{a.studentMatric}</td>
                  <td className="px-6 py-3">{a.present}</td>
                  <td className="px-6 py-3">{a.total}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      a.rate >= 75 ? 'bg-emerald-100 text-emerald-700' :
                      a.rate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {a.rate}%
                    </span>
                  </td>
                </tr>
              ))}
              {aggregates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No records for selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;

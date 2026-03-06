import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, BookOpen, Filter, GraduationCap, Search, Users } from 'lucide-react';
import { studentsOverviewService } from './service';
import type { StudentsOverviewData, StudentRecord, StudentStatus } from './types';

const StudentsOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<StudentsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  useEffect(() => {
    studentsOverviewService.getStudentsOverviewData().then(res => {
      setData(res);
      setSelectedSession(res.sessions[0] ?? '2024/2025');
      setLoading(false);
    });
  }, []);

  const studentsForSession = useMemo(() => {
    if (!data) return [];
    return data.students.filter(s => s.session === selectedSession);
  }, [data, selectedSession]);

  const faculties = useMemo(() => {
    return ['All', ...Array.from(new Set(studentsForSession.map(s => s.faculty)))];
  }, [studentsForSession]);

  const departments = useMemo(() => {
    const scoped = facultyFilter === 'All' ? studentsForSession : studentsForSession.filter(s => s.faculty === facultyFilter);
    return ['All', ...Array.from(new Set(scoped.map(s => s.department)))];
  }, [studentsForSession, facultyFilter]);

  const filteredStudents = useMemo(() => {
    const list = studentsForSession.filter(s => {
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesFaculty = facultyFilter === 'All' || s.faculty === facultyFilter;
      const matchesDept = deptFilter === 'All' || s.department === deptFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        s.fullName.toLowerCase().includes(q) ||
        s.matricNo.toLowerCase().includes(q) ||
        s.programme.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      return matchesStatus && matchesFaculty && matchesDept && matchesSearch;
    });
    return list;
  }, [studentsForSession, statusFilter, facultyFilter, deptFilter, searchQuery]);

  const openStudent = (student: StudentRecord) => {
    navigate('/super-admin/students-overview/student-details', { state: { student } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 font-medium">Loading Students Data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Overview</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">View all students under this institution</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800">
              <GraduationCap size={16} className="text-emerald-600 dark:text-emerald-400" />
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                {data.sessions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'students', label: 'Students', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dashboard' | 'students')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#151e32] text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Students</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{data.totals.total}</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Active</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{data.totals.active}</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Alumni</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{data.totals.alumni}</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Suspended</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{data.totals.suspended}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Students</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent students for {selectedSession}</p>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Student</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Matric No</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {studentsForSession.slice(0, 8).map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{s.fullName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{s.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{s.matricNo}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.programme}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openStudent(s)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, matric, programme..."
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white w-72"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'All')}
                  className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2">
                <BookOpen size={16} className="text-gray-400" />
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  {faculties.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2">
                <BookOpen size={16} className="text-gray-400" />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Student</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Matric No</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Faculty</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Department</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Level</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{s.fullName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{s.email}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{s.matricNo}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.programme}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.faculty}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.department}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.level}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.status}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openStudent(s)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsOverviewDashboard;


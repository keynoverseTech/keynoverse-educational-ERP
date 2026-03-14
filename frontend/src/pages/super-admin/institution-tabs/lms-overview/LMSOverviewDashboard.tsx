import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, BookOpen, ClipboardList, FileText, MessageSquare, Search } from 'lucide-react';
import { lmsOverviewService } from './service';
import type { LmsOverviewData, LmsCourseStatus, LmsAssignmentStatus, LmsQuizStatus } from './types';

const LMSOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LmsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'assignments' | 'quizzes' | 'discussions' | 'submissions'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseStatus, setCourseStatus] = useState<LmsCourseStatus | 'All'>('All');
  const [assignmentStatus, setAssignmentStatus] = useState<LmsAssignmentStatus | 'All'>('All');
  const [quizStatus, setQuizStatus] = useState<LmsQuizStatus | 'All'>('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedProgramme, setSelectedProgramme] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');

  useEffect(() => {
    lmsOverviewService.getLmsOverviewData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const faculties = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.courses.map((c) => c.faculty))).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const departments = useMemo(() => {
    if (!data) return [];
    const base = selectedFaculty === 'All' ? data.courses : data.courses.filter((c) => c.faculty === selectedFaculty);
    return Array.from(new Set(base.map((c) => c.department))).sort((a, b) => a.localeCompare(b));
  }, [data, selectedFaculty]);

  const programmes = useMemo(() => {
    if (!data) return [];
    let base = selectedFaculty === 'All' ? data.courses : data.courses.filter((c) => c.faculty === selectedFaculty);
    base = selectedDepartment === 'All' ? base : base.filter((c) => c.department === selectedDepartment);
    return Array.from(new Set(base.map((c) => c.programme))).sort((a, b) => a.localeCompare(b));
  }, [data, selectedDepartment, selectedFaculty]);

  const courseOptions = useMemo(() => {
    if (!data) return [];
    let base = selectedFaculty === 'All' ? data.courses : data.courses.filter((c) => c.faculty === selectedFaculty);
    base = selectedDepartment === 'All' ? base : base.filter((c) => c.department === selectedDepartment);
    base = selectedProgramme === 'All' ? base : base.filter((c) => c.programme === selectedProgramme);
    base.sort((a, b) => a.code.localeCompare(b.code));
    return base.map((c) => ({ id: c.id, code: c.code, title: c.title }));
  }, [data, selectedDepartment, selectedFaculty, selectedProgramme]);

  const courseByCode = useMemo(() => {
    if (!data) return new Map<string, any>();
    return new Map(data.courses.map((c) => [c.code, c]));
  }, [data]);

  const matchesAcademicFilters = (courseCode: string) => {
    const course = courseByCode.get(courseCode);
    if (!course) return false;
    if (selectedFaculty !== 'All' && course.faculty !== selectedFaculty) return false;
    if (selectedDepartment !== 'All' && course.department !== selectedDepartment) return false;
    if (selectedProgramme !== 'All' && course.programme !== selectedProgramme) return false;
    if (selectedCourse !== 'All' && course.code !== selectedCourse) return false;
    return true;
  };

  const filteredCourses = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.courses.filter((c) => {
      const matchesStatus = courseStatus === 'All' || c.status === courseStatus;
      const matchesFaculty = selectedFaculty === 'All' || c.faculty === selectedFaculty;
      const matchesDept = selectedDepartment === 'All' || c.department === selectedDepartment;
      const matchesProg = selectedProgramme === 'All' || c.programme === selectedProgramme;
      const matchesCourse = selectedCourse === 'All' || c.code === selectedCourse;
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      return matchesStatus && matchesFaculty && matchesDept && matchesProg && matchesCourse && matchesSearch;
    });
  }, [courseStatus, data, searchQuery, selectedCourse, selectedDepartment, selectedFaculty, selectedProgramme]);

  const filteredAssignments = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.assignments.filter((a) => {
      const matchesStatus = assignmentStatus === 'All' || a.status === assignmentStatus;
      const matchesSearch = !q || a.courseCode.toLowerCase().includes(q) || a.title.toLowerCase().includes(q);
      return matchesStatus && matchesSearch && matchesAcademicFilters(a.courseCode);
    });
  }, [assignmentStatus, data, searchQuery, courseByCode, selectedCourse, selectedDepartment, selectedFaculty, selectedProgramme]);

  const filteredQuizzes = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.quizzes.filter((qz) => {
      const matchesStatus = quizStatus === 'All' || qz.status === quizStatus;
      const matchesSearch = !q || qz.courseCode.toLowerCase().includes(q) || qz.title.toLowerCase().includes(q);
      return matchesStatus && matchesSearch && matchesAcademicFilters(qz.courseCode);
    });
  }, [data, quizStatus, searchQuery, courseByCode, selectedCourse, selectedDepartment, selectedFaculty, selectedProgramme]);

  const filteredDiscussions = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.discussions.filter((d) => {
      const matchesSearch = !q || d.courseCode.toLowerCase().includes(q) || d.topic.toLowerCase().includes(q);
      return matchesSearch && matchesAcademicFilters(d.courseCode);
    });
  }, [data, searchQuery, courseByCode, selectedCourse, selectedDepartment, selectedFaculty, selectedProgramme]);

  const filteredSubmissions = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.submissions.filter((s) => {
      const matchesSearch =
        !q ||
        s.courseCode.toLowerCase().includes(q) ||
        s.item.toLowerCase().includes(q) ||
        s.student.toLowerCase().includes(q);
      return matchesSearch && matchesAcademicFilters(s.courseCode);
    });
  }, [data, searchQuery, courseByCode, selectedCourse, selectedDepartment, selectedFaculty, selectedProgramme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium">Loading LMS Overview...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <BookOpen size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load LMS data</h3>
        <p className="text-gray-500 mt-2 mb-6">We couldn't fetch the latest LMS information.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LMS Overview</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Read-only visibility into courses, assessments, and engagement</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedFaculty('All');
              setSelectedDepartment('All');
              setSelectedProgramme('All');
              setSelectedCourse('All');
              setSearchQuery('');
              setCourseStatus('All');
              setAssignmentStatus('All');
              setQuizStatus('All');
            }}
            className="px-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors w-fit"
          >
            Reset Filters
          </button>
        </div>

        <div className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, items, students..."
              className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">Faculty</div>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setSelectedDepartment('All');
                  setSelectedProgramme('All');
                  setSelectedCourse('All');
                }}
                className="w-full bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
              >
                <option value="All">Select Faculty</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">Department</div>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedProgramme('All');
                  setSelectedCourse('All');
                }}
                className="w-full bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
              >
                <option value="All">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">Programme</div>
              <select
                value={selectedProgramme}
                onChange={(e) => {
                  setSelectedProgramme(e.target.value);
                  setSelectedCourse('All');
                }}
                className="w-full bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
              >
                <option value="All">Select Programme</option>
                {programmes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">Course</div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
              >
                <option value="All">Select Course</option>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.code}>{c.code} — {c.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl w-fit">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'assignments', label: 'Assignments', icon: ClipboardList },
          { id: 'quizzes', label: 'Quizzes', icon: FileText },
          { id: 'discussions', label: 'Discussions', icon: MessageSquare },
          { id: 'submissions', label: 'Submissions', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#151e32] text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Courses</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{data.summary.totalCourses}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All courses</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Active Courses</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{data.summary.activeCourses}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently running</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Assignments</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{data.summary.pendingAssignments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Open items</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Upcoming Quizzes</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{data.summary.upcomingQuizzes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scheduled</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Discussions</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{data.summary.discussions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Topics/replies</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Submissions</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{data.summary.submissions.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recently Updated Courses</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last changes in course content</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Instructor</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[...data.courses].slice(0, 6).map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{c.code}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{c.title}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.instructor}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            c.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{c.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Open Assignments</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Assignments that are still open</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Due</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Submissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.assignments.filter(a => a.status === 'Open').slice(0, 6).map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{a.courseCode}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{a.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{a.status}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{a.dueDate}</td>
                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{a.submissions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={courseStatus}
              onChange={(e) => setCourseStatus(e.target.value as any)}
              className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Instructor</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Learners</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{c.code}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{c.title}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.instructor}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.learners.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{c.updatedAt}</td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={assignmentStatus}
              onChange={(e) => setAssignmentStatus(e.target.value as any)}
              className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Due</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{a.courseCode}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{a.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{a.status}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{a.dueDate}</td>
                      <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{a.submissions}</td>
                    </tr>
                  ))}
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No assignments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={quizStatus}
              onChange={(e) => setQuizStatus(e.target.value as any)}
              className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
            >
              <option value="All">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Scheduled</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Participants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredQuizzes.map((qz) => (
                    <tr key={qz.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{qz.courseCode}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{qz.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{qz.status}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{qz.scheduledDate}</td>
                      <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{qz.participants.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredQuizzes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No quizzes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Topic</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Replies</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredDiscussions.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{d.courseCode}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{d.topic}</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{d.replies}</td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{d.lastActivity}</td>
                  </tr>
                ))}
                {filteredDiscussions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No discussions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Item</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Submitted</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{s.courseCode}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.item}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{s.student}</td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{s.submittedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        s.status === 'Graded'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LMSOverviewDashboard;

import React, { useMemo, useState } from 'react';
import { Calendar, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../../../../state/academics/attendanceContext';
import { getAssignedCourses } from '../assignedCourses';

const AttendanceDashboard: React.FC = () => {
  const { sessions, createSession } = useAttendance();
  const navigate = useNavigate();
  const assigned = useMemo(() => getAssignedCourses(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    courseCode: assigned[0]?.code || '',
    courseTitle: assigned[0]?.title || '',
    lecturerName: 'Dr. Alan Turing',
    department: 'Computer Science',
    program: 'HND Computer Science',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: ''
  });

  const allowedCodes = useMemo(() => new Set(assigned.map(c => c.code)), [assigned]);

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const isMine = allowedCodes.has(s.courseCode.replace(/\s+/g, '')) || allowedCodes.has(s.courseCode);
      if (!isMine) return false;
      const matchesSearch = s.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lecturerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === 'All' ? true : s.courseCode === filterCourse;
      return matchesSearch && matchesCourse;
    });
  }, [sessions, allowedCodes, searchTerm, filterCourse]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createSession(newSession);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400">Create sessions and mark attendance for your courses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Session
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by course code or lecturer..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="All">All My Courses</option>
          {assigned.map(c => (
            <option key={c.id} value={c.code}>{c.code}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSessions.map(session => (
          <div key={session.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{session.courseCode}</h3>
                  <p className="text-xs text-gray-500">{session.courseTitle}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                session.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {session.isActive ? 'Active' : 'Closed'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <p>Date: {session.date}</p>
              <p>Time: {session.startTime} - {session.endTime}</p>
              <p>Attendance: {session.records.filter(r => r.status === 'Present').length} / {session.records.length} Present</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => navigate(`/staff/academics/attendance/mark/${session.id}`)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        ))}
        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No sessions found for your courses. Create one to get started.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Attendance Session</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSession.courseCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const c = assigned.find(x => x.code === code);
                    setNewSession(prev => ({ ...prev, courseCode: code, courseTitle: c?.title || prev.courseTitle }));
                  }}
                >
                  <option value="">Select course...</option>
                  {assigned.map(c => (
                    <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, Check, X, ArrowLeft, RefreshCw, Lock, Save, Users, Copy } from 'lucide-react';
import { useAttendance } from '../../../../state/academics/attendanceContext';
// @ts-ignore
import QRCode from 'react-qr-code';

const MarkAttendance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, markAttendance, markAll, submitAttendance } = useAttendance();
  const session = sessions.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'manual' | 'qr' | 'link'>('manual');
  const [searchTerm, setSearchTerm] = useState('');

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <p className="text-lg font-medium">Session not found</p>
        <p className="text-sm mt-2">This session may have been deleted or does not exist.</p>
        <button onClick={() => navigate('/staff/academics/attendance')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const filteredRecords = session.records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentMatric.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyLink = () => {
    if (session.link) {
      navigator.clipboard.writeText(session.link);
      alert('Attendance link copied to clipboard!');
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit this attendance? This action cannot be undone.')) {
      if (id) {
        submitAttendance(id);
        // alert('Attendance submitted successfully!');
        // Stay on page to show locked state or navigate back? Usually navigating back is better UX.
        navigate('/staff/academics/attendance');
      }
    }
  };

  const handleMarkAllPresent = () => {
    if (id && window.confirm('Mark all students as Present?')) {
      markAll(id, 'Present');
    }
  };

  const handleMarkAllAbsent = () => {
    if (id && window.confirm('Mark all students as Absent?')) {
      markAll(id, 'Absent');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <div className="flex gap-3 w-full md:w-auto justify-end">
          {session.isSubmitted ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-600 cursor-not-allowed">
              <Lock size={16} /> Submitted
            </span>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Save size={18} /> Submit Attendance
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {session.courseCode}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${session.isSubmitted ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {session.isSubmitted ? 'Closed' : 'Active Session'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{session.courseTitle}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><Users size={16} /> {session.lecturerName}</span>
                <span className="flex items-center gap-1.5"><RefreshCw size={16} /> {session.startTime} - {session.endTime}</span>
                <span className="flex items-center gap-1.5"><Check size={16} /> {session.date}</span>
              </div>
            </div>
          </div>
        </div>

        {!session.isSubmitted && (
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'manual' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Manual Roll Call
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'qr' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'link' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Share Link
            </button>
          </div>
        )}

        <div className="p-6">
          {(activeTab === 'manual' || session.isSubmitted) && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="flex-1 max-w-md px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {!session.isSubmitted && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleMarkAllPresent}
                      className="px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border border-green-200 dark:border-green-800"
                    >
                      Mark All Present
                    </button>
                    <button 
                      onClick={handleMarkAllAbsent}
                      className="px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{record.studentName}</span>
                            <span className="text-gray-500 text-xs font-mono">{record.studentMatric}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            record.status === 'Present' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.status === 'Present' ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                            {record.status}
                          </span>
                          {record.timestamp && (
                            <span className="ml-2 text-xs text-gray-400">at {record.timestamp}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!session.isSubmitted ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => markAttendance(session.id, record.studentId, 'Present')}
                                className={`p-2 rounded-lg transition-all ${
                                  record.status === 'Present' 
                                    ? 'bg-green-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600 dark:bg-gray-800 dark:hover:bg-green-900/30'
                                }`}
                                title="Mark Present"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => markAttendance(session.id, record.studentId, 'Absent')}
                                className={`p-2 rounded-lg transition-all ${
                                  record.status === 'Absent' 
                                    ? 'bg-red-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-900/30'
                                }`}
                                title="Mark Absent"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-gray-400 italic">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          <Users size={48} className="mx-auto mb-3 opacity-20" />
                          <p>No students found matching your search.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'qr' && !session.isSubmitted && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in zoom-in-95">
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-100 relative">
                <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-3xl -m-2 -z-10"></div>
                <QRCode value={session.qrCode || ''} size={280} />
              </div>
              <div className="text-center max-w-md space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Scan for Attendance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Ask students to scan this QR code using their student app to mark their attendance automatically.
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                <RefreshCw size={18} /> Regenerate Code
              </button>
            </div>
          )}

          {activeTab === 'link' && !session.isSubmitted && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <Link size={48} />
              </div>
              <div className="text-center max-w-lg space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Attendance Link</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Students can use this link to mark attendance remotely. Ideally share this in your class group chat.
                </p>
              </div>
              
              <div className="flex items-center gap-2 w-full max-w-lg bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  readOnly
                  value={session.link}
                  className="flex-1 px-4 py-2 bg-transparent text-gray-600 dark:text-gray-300 focus:outline-none text-sm font-mono"
                />
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
                >
                  <Copy size={16} /> Copy
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
                <Lock size={12} />
                This link will expire automatically when you submit the session.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

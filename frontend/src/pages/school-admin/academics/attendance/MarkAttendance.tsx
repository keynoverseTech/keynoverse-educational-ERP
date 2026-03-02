import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, Link, Check, X, User, ArrowLeft, RefreshCw, Lock, Save } from 'lucide-react';
import { useAttendance } from '../../../../state/academics/attendanceContext';
import QRCode from 'react-qr-code';

const MarkAttendance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, markAttendance, submitAttendance } = useAttendance();
  const session = sessions.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'manual' | 'qr' | 'link'>('manual');
  const [searchTerm, setSearchTerm] = useState('');

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <p>Session not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
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
        alert('Attendance submitted successfully!');
        navigate('/school-admin/academics/attendance');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <div className="flex gap-3">
          {session.isSubmitted ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium border border-gray-200">
              <Lock size={16} /> Submitted
            </span>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={18} /> Submit Attendance
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{session.courseCode}: {session.courseTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {session.date} • {session.startTime} - {session.endTime} • {session.lecturerName}
        </p>

        {!session.isSubmitted && (
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('manual')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manual Marking
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'qr' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'link' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Share Link
            </button>
          </div>
        )}

        {(activeTab === 'manual' || session.isSubmitted) && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Matric No</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{record.studentName}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{record.studentMatric}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!session.isSubmitted && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => markAttendance(session.id, record.studentId, 'Present')}
                              className={`p-1 rounded hover:bg-green-100 text-green-600 transition-colors ${record.status === 'Present' ? 'bg-green-50' : ''}`}
                              title="Mark Present"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => markAttendance(session.id, record.studentId, 'Absent')}
                              className={`p-1 rounded hover:bg-red-100 text-red-600 transition-colors ${record.status === 'Absent' ? 'bg-red-50' : ''}`}
                              title="Mark Absent"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                        {session.isSubmitted && (
                          <span className="text-xs text-gray-400 italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'qr' && !session.isSubmitted && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <QRCode value={session.qrCode || ''} size={256} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
              Ask students to scan this QR code using the mobile app to mark their attendance automatically.
            </p>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <RefreshCw size={18} /> Regenerate Code
            </button>
          </div>
        )}

        {activeTab === 'link' && !session.isSubmitted && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <Link size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Attendance Link</h3>
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                type="text"
                readOnly
                value={session.link}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              This link will expire when the session ends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;

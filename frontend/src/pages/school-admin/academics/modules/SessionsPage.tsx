import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Closed' | 'Upcoming';
}

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', name: '2024/2025', startDate: '2024-09-01', endDate: '2025-07-30', status: 'Active' },
    { id: '2', name: '2023/2024', startDate: '2023-09-01', endDate: '2024-07-30', status: 'Closed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<Session>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSession.id) {
      setSessions(sessions.map(s => s.id === currentSession.id ? { ...s, ...currentSession } as Session : s));
    } else {
      setSessions([...sessions, { ...currentSession, id: Math.random().toString(36).substr(2, 9), status: 'Upcoming' } as Session]);
    }
    setIsModalOpen(false);
    setCurrentSession({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Sessions</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage academic years and their durations.</p>
        </div>
        <button 
          onClick={() => { setCurrentSession({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Session
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <Calendar className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">Information</h3>
          <p className="text-sm text-blue-800 dark:text-blue-400">Sessions are referenced by semesters and student enrollments. Ensure dates do not overlap significantly.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Session Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Start Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">End Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{session.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{session.startDate}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{session.endDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    session.status === 'Closed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentSession(session); setIsModalOpen(true); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentSession.id ? 'Edit Session' : 'New Session'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session Name</label>
                <input 
                  type="text" 
                  value={currentSession.name || ''}
                  onChange={e => setCurrentSession({...currentSession, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. 2024/2025"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={currentSession.startDate || ''}
                    onChange={e => setCurrentSession({...currentSession, startDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={currentSession.endDate || ''}
                    onChange={e => setCurrentSession({...currentSession, endDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  value={currentSession.status || 'Upcoming'}
                  onChange={e => setCurrentSession({...currentSession, status: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

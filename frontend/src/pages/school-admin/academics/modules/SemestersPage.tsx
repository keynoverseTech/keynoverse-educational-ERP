import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  examStartDate: string;
  examEndDate: string;
  sessionId?: string;
}

export const SemestersPage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { 
      id: '1', 
      name: 'First Semester', 
      startDate: '2024-09-01', 
      endDate: '2024-12-20',
      examStartDate: '2024-12-05',
      examEndDate: '2024-12-19',
      sessionId: '1'
    },
  ]);

  // Mock sessions for linkage
  const sessions = [
    { id: '1', name: '2024/2025' },
    { id: '2', name: '2025/2026' }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<Partial<Semester>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSemester.id) {
      setSemesters(semesters.map(s => s.id === currentSemester.id ? { ...s, ...currentSemester } as Semester : s));
    } else {
      setSemesters([...semesters, { ...currentSemester, id: Math.random().toString(36).substr(2, 9) } as Semester]);
    }
    setIsModalOpen(false);
    setCurrentSemester({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Semesters</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage semesters and examination periods.</p>
        </div>
        <button 
          onClick={() => { setCurrentSemester({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Semester
        </button>
      </div>

      {!currentSemester.sessionId && (
         <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
           <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
           <div>
             <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">Note</h3>
             <p className="text-sm text-yellow-800 dark:text-yellow-400">You can create a semester without linking a session, but it is recommended to link one later.</p>
           </div>
         </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Semester Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Linked Session</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Duration</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Exam Period</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {semesters.map(sem => (
              <tr key={sem.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{sem.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {sessions.find(s => s.id === sem.sessionId)?.name || <span className="text-gray-400 italic">Not Linked</span>}
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                  {sem.startDate} - {sem.endDate}
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                  {sem.examStartDate} - {sem.examEndDate}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentSemester(sem); setIsModalOpen(true); }}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentSemester.id ? 'Edit Semester' : 'New Semester'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester Name</label>
                <input 
                  type="text" 
                  value={currentSemester.name || ''}
                  onChange={e => setCurrentSemester({...currentSemester, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. First Semester"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Session (Optional)</label>
                <select 
                  value={currentSemester.sessionId || ''}
                  onChange={e => setCurrentSemester({...currentSemester, sessionId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select Session --</option>
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {!currentSemester.sessionId && (
                   <p className="text-xs text-orange-500 mt-1">No academic session linked. You can link later.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={currentSemester.startDate || ''}
                    onChange={e => setCurrentSemester({...currentSemester, startDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={currentSemester.endDate || ''}
                    onChange={e => setCurrentSemester({...currentSemester, endDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Examination Period</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Start</label>
                    <input 
                        type="date" 
                        value={currentSemester.examStartDate || ''}
                        onChange={e => setCurrentSemester({...currentSemester, examStartDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam End</label>
                    <input 
                        type="date" 
                        value={currentSemester.examEndDate || ''}
                        onChange={e => setCurrentSemester({...currentSemester, examEndDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    </div>
                </div>
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
                  Save Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

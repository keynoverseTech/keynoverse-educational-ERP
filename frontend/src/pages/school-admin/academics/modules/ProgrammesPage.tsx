import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Programme {
  id: string;
  name: string;
  degreeType: string;
  duration: number;
  departmentId?: string;
}

export const ProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([
    { id: '1', name: 'B.Eng Computer Engineering', degreeType: 'B.Eng', duration: 5, departmentId: '1' },
    { id: '2', name: 'B.Sc Biochemistry', degreeType: 'B.Sc', duration: 4, departmentId: '3' },
  ]);

  const departments = [
    { id: '1', name: 'Computer Engineering' },
    { id: '2', name: 'Electrical Engineering' },
    { id: '3', name: 'Biochemistry' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProg, setCurrentProg] = useState<Partial<Programme>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProg.id) {
      setProgrammes(programmes.map(p => p.id === currentProg.id ? { ...p, ...currentProg } as Programme : p));
    } else {
      setProgrammes([...programmes, { ...currentProg, id: Math.random().toString(36).substr(2, 9) } as Programme]);
    }
    setIsModalOpen(false);
    setCurrentProg({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Programmes</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage degree programmes and durations.</p>
        </div>
        <button 
          onClick={() => { setCurrentProg({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Programme
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Programme Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Degree Type</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Duration (Years)</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {programmes.map(prog => (
              <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{prog.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{prog.degreeType}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{prog.duration}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {departments.find(d => d.id === prog.departmentId)?.name || <span className="text-gray-400 italic">Not Linked</span>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentProg(prog); setIsModalOpen(true); }}
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentProg.id ? 'Edit Programme' : 'New Programme'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Programme Name</label>
                <input 
                  type="text" 
                  value={currentProg.name || ''}
                  onChange={e => setCurrentProg({...currentProg, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. B.Eng Computer Engineering"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree Type</label>
                  <select 
                    value={currentProg.degreeType || 'B.Sc'}
                    onChange={e => setCurrentProg({...currentProg, degreeType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Eng">B.Eng</option>
                    <option value="B.A">B.A</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Years)</label>
                  <input 
                    type="number" 
                    value={currentProg.duration || 4}
                    onChange={e => setCurrentProg({...currentProg, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department (Optional)</label>
                <select 
                  value={currentProg.departmentId || ''}
                  onChange={e => setCurrentProg({...currentProg, departmentId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
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
                  Save Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Level {
  id: string;
  name: string;
  programmeId?: string;
  description?: string;
}

export const LevelsPage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([
    { id: '1', name: '100 Level', description: 'Freshman Year' },
    { id: '2', name: '200 Level', description: 'Sophomore Year' },
    { id: '3', name: '300 Level', description: 'Junior Year' },
    { id: '4', name: '400 Level', description: 'Senior Year' },
    { id: '5', name: '500 Level', description: 'Final Year (Engineering)' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Partial<Level>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentLevel.id) {
      setLevels(levels.map(l => l.id === currentLevel.id ? { ...l, ...currentLevel } as Level : l));
    } else {
      setLevels([...levels, { ...currentLevel, id: Math.random().toString(36).substr(2, 9) } as Level]);
    }
    setIsModalOpen(false);
    setCurrentLevel({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Levels</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage academic levels (e.g., 100, 200, 300).</p>
        </div>
        <button 
          onClick={() => { setCurrentLevel({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Level
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Level Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Description</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {levels.map(lvl => (
              <tr key={lvl.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{lvl.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{lvl.description}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentLevel(lvl); setIsModalOpen(true); }}
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentLevel.id ? 'Edit Level' : 'New Level'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level Name</label>
                <input 
                  type="text" 
                  value={currentLevel.name || ''}
                  onChange={e => setCurrentLevel({...currentLevel, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. 100 Level"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={currentLevel.description || ''}
                  onChange={e => setCurrentLevel({...currentLevel, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Freshman Year"
                />
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
                  Save Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

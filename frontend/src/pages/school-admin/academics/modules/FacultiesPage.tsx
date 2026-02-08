import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  deanName?: string;
}

export const FacultiesPage: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: '1', name: 'Faculty of Engineering', code: 'ENG', status: 'Active', deanName: 'Dr. Alan Grant' },
    { id: '2', name: 'Faculty of Sciences', code: 'SCI', status: 'Active', deanName: 'Prof. Ellie Sattler' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Partial<Faculty>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentFaculty.id) {
      setFaculties(faculties.map(f => f.id === currentFaculty.id ? { ...f, ...currentFaculty } as Faculty : f));
    } else {
      setFaculties([...faculties, { ...currentFaculty, id: Math.random().toString(36).substr(2, 9), status: currentFaculty.status || 'Active' } as Faculty]);
    }
    setIsModalOpen(false);
    setCurrentFaculty({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculties</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage university faculties and their deans.</p>
        </div>
        <button 
          onClick={() => { setCurrentFaculty({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Faculty
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <Building2 className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">Structure Information</h3>
          <p className="text-sm text-blue-800 dark:text-blue-400">Faculties are the top-level academic units that group related departments.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Faculty Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Code</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Dean</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {faculties.map(faculty => (
              <tr key={faculty.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{faculty.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{faculty.code}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{faculty.deanName || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    faculty.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {faculty.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentFaculty(faculty); setIsModalOpen(true); }}
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentFaculty.id ? 'Edit Faculty' : 'New Faculty'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty Name</label>
                <input 
                  type="text" 
                  value={currentFaculty.name || ''}
                  onChange={e => setCurrentFaculty({...currentFaculty, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Faculty of Engineering"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <input 
                    type="text" 
                    value={currentFaculty.code || ''}
                    onChange={e => setCurrentFaculty({...currentFaculty, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g. ENG"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select 
                    value={currentFaculty.status || 'Active'}
                    onChange={e => setCurrentFaculty({...currentFaculty, status: e.target.value as Faculty['status']})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dean (Optional)</label>
                <input 
                  type="text" 
                  value={currentFaculty.deanName || ''}
                  onChange={e => setCurrentFaculty({...currentFaculty, deanName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search for staff..."
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
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

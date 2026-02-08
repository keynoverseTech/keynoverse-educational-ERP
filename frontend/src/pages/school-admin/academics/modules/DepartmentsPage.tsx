import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  facultyId?: string;
  headOfDepartment?: string;
}

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Computer Science', code: 'CSC', facultyId: '3', headOfDepartment: 'Dr. Sarah Connor' },
    { id: '2', name: 'Computer Engineering', code: 'CPE', facultyId: '1', headOfDepartment: 'Dr. Wu' },
    { id: '3', name: 'Electrical Engineering', code: 'EEE', facultyId: '1' },
    { id: '4', name: 'Biochemistry', code: 'BCH', facultyId: '2' },
  ]);

  const faculties = [
    { id: '1', name: 'Faculty of Engineering' },
    { id: '2', name: 'Faculty of Sciences' },
    { id: '3', name: 'Faculty of Computing' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Partial<Department>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDept.id) {
      setDepartments(departments.map(d => d.id === currentDept.id ? { ...d, ...currentDept } as Department : d));
    } else {
      setDepartments([...departments, { ...currentDept, id: Math.random().toString(36).substr(2, 9) } as Department]);
    }
    setIsModalOpen(false);
    setCurrentDept({});
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage academic departments under faculties.</p>
        </div>
        <button 
          onClick={() => { setCurrentDept({}); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Department Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Code</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Faculty</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">HOD</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {departments.map(dept => (
              <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{dept.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{dept.code}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {faculties.find(f => f.id === dept.facultyId)?.name || <span className="text-orange-500 text-xs">No Faculty Linked</span>}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{dept.headOfDepartment || '-'}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setCurrentDept(dept); setIsModalOpen(true); }}
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentDept.id ? 'Edit Department' : 'New Department'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name</label>
                <input 
                  type="text" 
                  value={currentDept.name || ''}
                  onChange={e => setCurrentDept({...currentDept, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Computer Engineering"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                <input 
                  type="text" 
                  value={currentDept.code || ''}
                  onChange={e => setCurrentDept({...currentDept, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. CPE"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty (Optional)</label>
                <select 
                  value={currentDept.facultyId || ''}
                  onChange={e => setCurrentDept({...currentDept, facultyId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                {!currentDept.facultyId && (
                   <p className="text-xs text-orange-500 mt-1">This department is not linked to a faculty yet.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Head of Department (Optional)</label>
                <input 
                  type="text" 
                  value={currentDept.headOfDepartment || ''}
                  onChange={e => setCurrentDept({...currentDept, headOfDepartment: e.target.value})}
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

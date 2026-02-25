import React, { useState } from 'react';
import { Building2, Edit, Trash2, Plus } from 'lucide-react';
import type { DepartmentType } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

const HRDepartments: React.FC = () => {
  const { departments, setDepartments } = useHR();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<DepartmentType>('Administrative');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setType('Academic');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    if (editingId) {
      setDepartments(prev =>
        prev.map(dep =>
          dep.id === editingId ? { ...dep, name: name.trim(), type } : dep
        )
      );
    } else {
      const id = `dept_${Date.now()}`;
      setDepartments(prev => [...prev, { id, name: name.trim(), type }]);
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    setEditingId(id);
    setName(dept.name);
    setType(dept.type);
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(dep => dep.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Departments Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure academic, administrative and service departments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Department' : 'Create Department'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as DepartmentType)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Administrative">Administrative</option>
                <option value="Service">Service</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Create Department'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Existing Departments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {departments
                  .filter(dept => dept.type !== 'Academic')
                  .map(dept => (
                  <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {dept.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {dept.type}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(dept.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDepartments;

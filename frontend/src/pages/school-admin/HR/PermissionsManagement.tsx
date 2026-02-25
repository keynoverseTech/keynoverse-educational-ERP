import React, { useState } from 'react';
import { Shield, Edit, Trash2, Plus } from 'lucide-react';
import type { PermissionModule } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

const PermissionsManagement: React.FC = () => {
  const { permissions, setPermissions } = useHR();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState<PermissionModule>('Student');

  const resetForm = () => {
    setEditingId(null);
    setKeyValue('');
    setDescription('');
    setModule('Student');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) {
      return;
    }
    if (editingId) {
      setPermissions(prev =>
        prev.map(p =>
          p.id === editingId
            ? { ...p, key: keyValue.trim(), description: description.trim(), module }
            : p
        )
      );
    } else {
      const id = `perm_${Date.now()}`;
      setPermissions(prev => [
        ...prev,
        { id, key: keyValue.trim(), description: description.trim(), module },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const perm = permissions.find(p => p.id === id);
    if (!perm) return;
    setEditingId(id);
    setKeyValue(perm.key);
    setDescription(perm.description);
    setModule(perm.module);
  };

  const handleDelete = (id: string) => {
    setPermissions(prev => prev.filter(p => p.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const modules: PermissionModule[] = [
    'Student',
    'Exams',
    'HR',
    'Finance',
    'Library',
    'Hostel',
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Permissions Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure atomic actions that control access across modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Permission' : 'Create Permission'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Permission Key
              </label>
              <input
                value={keyValue}
                onChange={e => setKeyValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. upload_result"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short explanation of what this permission does"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Module
              </label>
              <select
                value={module}
                onChange={e => setModule(e.target.value as PermissionModule)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {modules.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
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
                {editingId ? 'Save Changes' : 'Create Permission'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Permissions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Permission Key
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Module
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {permissions.map(perm => (
                  <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-mono text-xs">
                      {perm.key}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {perm.description}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {perm.module}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(perm.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(perm.id)}
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

export default PermissionsManagement;

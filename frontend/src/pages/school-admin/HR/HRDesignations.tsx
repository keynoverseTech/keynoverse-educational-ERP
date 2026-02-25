import React, { useState } from 'react';
import { IdCard, Edit, Trash2, Plus } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';

const HRDesignations: React.FC = () => {
  const { designations, setDesignations } = useHR();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    if (editingId) {
      setDesignations(prev =>
        prev.map(des =>
          des.id === editingId ? { ...des, name: name.trim() } : des
        )
      );
    } else {
      const id = `des_${Date.now()}`;
      setDesignations(prev => [...prev, { id, name: name.trim() }]);
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const des = designations.find(d => d.id === id);
    if (!des) return;
    setEditingId(id);
    setName(des.name);
  };

  const handleDelete = (id: string) => {
    setDesignations(prev => prev.filter(des => des.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text.white flex items-center gap-2">
            <IdCard className="w-7 h-7 text-blue-600" />
            Designations Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define HR titles such as HOD, Registrar, Lecturer II
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Designation' : 'Add Designation'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Designation Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text.white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Head of Department"
              />
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
                {editingId ? 'Save Changes' : 'Add Designation'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Existing Designations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {designations.map(des => (
                  <tr key={des.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {des.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(des.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(des.id)}
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

export default HRDesignations;


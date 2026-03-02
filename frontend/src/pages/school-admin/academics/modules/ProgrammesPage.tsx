import React, { useState } from 'react';
import { ShieldCheck, Lock, Users } from 'lucide-react';
import { mockProgrammes } from '../../../../data/mockData';
import type { Programme } from '../../../../data/mockData';

export const ProgrammesPage: React.FC = () => {
  // Only show local programmes created by this institution
  const [programmes] = useState<Programme[]>(mockProgrammes);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Super Admin Management Header */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-xl flex gap-4 items-start mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            Managed by Super Admin
            <Lock size={14} className="text-blue-400" />
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
            The list of available degree programmes is configured at the institution level by the Super Admin. Please contact your system administrator to add or modify programmes.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Programmes
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View available degree programmes and capacities.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Programme Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Degree Type</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Capacity</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Current Users</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Expiration</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {programmes.map(prog => (
              <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{prog.name}</span>
                    {prog.isGlobal && (
                      <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase rounded border border-purple-100 dark:border-purple-900/30">Super Admin</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{prog.degreeType}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{prog.studentCapacity || 'N/A'}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    {prog.currentUsers || 0}
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{prog.expirationDate || 'N/A'}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="px-3 py-1 bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Lock size={10} />
                      ReadOnly
                    </div>
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">Read Only View</h2>
            <p className="text-gray-500 dark:text-gray-400">
              This programme is managed by the Super Admin. You cannot edit or delete it.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

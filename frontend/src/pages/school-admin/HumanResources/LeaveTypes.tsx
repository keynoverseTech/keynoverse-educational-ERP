import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useHR, type LeaveType } from '../../../state/hrAccessControl';

const LeaveTypes: React.FC = () => {
  const { leaveTypes, setLeaveTypes } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Partial<LeaveType>>({});

  const handleOpenCreate = () => {
    setCurrentType({ 
      carryForward: false, 
      requiresAttachment: false,
      maxDays: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: LeaveType) => {
    setCurrentType(type);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      setLeaveTypes(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentType.name || !currentType.maxDays) return;

    if (currentType.id) {
      setLeaveTypes(prev => prev.map(t => t.id === currentType.id ? { ...t, ...currentType } as LeaveType : t));
    } else {
      const newType: LeaveType = {
        id: `leave_${Date.now()}`,
        name: currentType.name,
        maxDays: Number(currentType.maxDays),
        carryForward: Boolean(currentType.carryForward),
        requiresAttachment: Boolean(currentType.requiresAttachment)
      };
      setLeaveTypes(prev => [...prev, newType]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Leave Types Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Define available leave categories and their policies
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Leave Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaveTypes.map(type => (
          <div key={type.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{type.name}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(type)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(type.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Annual Entitlement</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{type.maxDays} Days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Carry Forward</span>
                {type.carryForward ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <Check size={12} /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <X size={12} /> No
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Requires Proof</span>
                {type.requiresAttachment ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                    <Check size={12} /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <X size={12} /> No
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentType.id ? 'Edit Leave Type' : 'Create Leave Type'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Name</label>
                <input 
                  type="text" 
                  value={currentType.name || ''}
                  onChange={e => setCurrentType({...currentType, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Maternity Leave"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Days (Per Year)</label>
                <input 
                  type="number" 
                  value={currentType.maxDays || ''}
                  onChange={e => setCurrentType({...currentType, maxDays: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 14"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentType.carryForward || false}
                    onChange={e => setCurrentType({...currentType, carryForward: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Allow Carry Forward</span>
                    <span className="block text-xs text-gray-500">Unused days can be moved to next year</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentType.requiresAttachment || false}
                    onChange={e => setCurrentType({...currentType, requiresAttachment: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Require Attachment</span>
                    <span className="block text-xs text-gray-500">Staff must upload proof (e.g. medical report)</span>
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, Coins, Check, X } from 'lucide-react';
import { useFinance, type FeeStructure } from '../../../state/financeContext';
// import { useHR } from '../../../state/hrAccessControl';

const FeeStructurePage: React.FC = () => {
  const { feeStructures, setFeeStructures } = useFinance();
  // const { hasPermission } = useHR(); // In real app, check permissions
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<Partial<FeeStructure>>({});
  const [filterSession, setFilterSession] = useState('All');

  // Simulation: defaulting to "All" session
  const filteredFees = feeStructures.filter(fee => 
    filterSession === 'All' || fee.session === filterSession
  );

  const handleOpenCreate = () => {
    setCurrentFee({ 
      isRecurring: true, 
      session: '2024/2025'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fee: FeeStructure) => {
    setCurrentFee(fee);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      setFeeStructures(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFee.name || !currentFee.amount) return;

    if (currentFee.id) {
      setFeeStructures(prev => prev.map(f => f.id === currentFee.id ? { ...f, ...currentFee } as FeeStructure : f));
    } else {
      const newFee: FeeStructure = {
        id: `fee_${Date.now()}`,
        name: currentFee.name,
        amount: Number(currentFee.amount),
        programId: currentFee.programId || null,
        levelId: currentFee.levelId || null,
        session: currentFee.session || '2024/2025',
        isRecurring: Boolean(currentFee.isRecurring),
        createdAt: new Date().toISOString()
      };
      setFeeStructures(prev => [...prev, newFee]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Coins className="w-7 h-7 text-blue-600" />
            Fee Structure
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure tuition and other fees for different programs and levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Sessions</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
            </select>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={16} />
            Create Fee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.map(fee => (
          <div key={fee.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{fee.name}</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full mt-1 inline-block">
                  {fee.session}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(fee)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(fee.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₦{fee.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Recurring</span>
                {fee.isRecurring ? (
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
                <span className="text-sm text-gray-500 dark:text-gray-400">Scope</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                  {fee.programId ? 'Program Specific' : fee.levelId ? 'Level Specific' : 'General'}
                </span>
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
                {currentFee.id ? 'Edit Fee Structure' : 'Create Fee Structure'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Name</label>
                <input 
                  type="text" 
                  value={currentFee.name || ''}
                  onChange={e => setCurrentFee({...currentFee, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Tuition Fee"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
                <input 
                  type="number" 
                  value={currentFee.amount || ''}
                  onChange={e => setCurrentFee({...currentFee, amount: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 150000"
                  min="0"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session</label>
                  <select
                    value={currentFee.session || ''}
                    onChange={e => setCurrentFee({...currentFee, session: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level (Optional)</label>
                  <select
                    value={currentFee.levelId || ''}
                    onChange={e => setCurrentFee({...currentFee, levelId: e.target.value || null})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="level_100">100 Level</option>
                    <option value="level_200">200 Level</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentFee.isRecurring || false}
                    onChange={e => setCurrentFee({...currentFee, isRecurring: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Recurring Fee</span>
                    <span className="block text-xs text-gray-500">Applied every session automatically</span>
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
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructurePage;

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Filter, BookOpen, HeartPulse, Home, FlaskConical } from 'lucide-react';
import { useFinance, type FeeStructure } from '../../../../state/financeContext';

const FeeConfigurationPage: React.FC = () => {
  const { feeStructures, setFeeStructures } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<Partial<FeeStructure>>({});
  const [filterType, setFilterType] = useState('All');
  const [customFeeName, setCustomFeeName] = useState('');
  const [isCustomFee, setIsCustomFee] = useState(false);

  // Pre-defined fee types/categories for demo
  const feeTypes = [
    { id: 'tuition', label: 'Tuition Fee' },
    { id: 'lab', label: 'Laboratory Fee' },
    { id: 'library', label: 'Library Fee' },
    { id: 'medical', label: 'Medical Fee' },
    { id: 'hostel', label: 'Hostel Fee' },
    { id: 'acceptance', label: 'Acceptance Fee' },
    { id: 'departmental', label: 'Departmental Due' }
  ];

  // Mock programmes data (in a real app, this would come from a context/API shared with ProgrammesPage)
  const programmes = [
    { id: '1', name: 'ND Computer Science' },
    { id: '2', name: 'HND Software Engineering' },
    { id: '3', name: 'ND Accountancy' },
    { id: '4', name: 'HND Business Administration' }
  ];

  const getIconForFee = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('lab')) return <FlaskConical size={20} className="text-purple-600" />;
    if (lower.includes('medical') || lower.includes('health')) return <HeartPulse size={20} className="text-red-600" />;
    if (lower.includes('hostel') || lower.includes('accommodation')) return <Home size={20} className="text-orange-600" />;
    if (lower.includes('library') || lower.includes('book')) return <BookOpen size={20} className="text-blue-600" />;
    return <div className="w-5 h-5 rounded-full bg-gray-200" />;
  };

  const handleOpenCreate = () => {
    setCurrentFee({ 
      isRecurring: true, 
      session: '2024/2025',
      name: 'Laboratory Fee' // Default example
    });
    setIsCustomFee(false);
    setCustomFeeName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fee: FeeStructure) => {
    setCurrentFee(fee);
    // Check if the current fee name is one of the predefined types
    const isStandard = feeTypes.some(t => t.label === fee.name);
    setIsCustomFee(!isStandard);
    if (!isStandard) {
        setCustomFeeName(fee.name);
    } else {
        setCustomFeeName('');
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee configuration?')) {
      setFeeStructures(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = isCustomFee ? customFeeName : currentFee.name;
    
    if (!finalName || !currentFee.amount) return;
    
    // Update the name in the object before saving
    const feeToSave = { ...currentFee, name: finalName };

    if (currentFee.id) {
      setFeeStructures(prev => prev.map(f => f.id === currentFee.id ? { ...f, ...feeToSave } as FeeStructure : f));
    } else {
      const newFee: FeeStructure = {
        id: `fee_conf_${Date.now()}`,
        name: finalName,
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

  const filteredFees = feeStructures.filter(f => filterType === 'All' || f.name.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Fee Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set up and map fees to specific programs, levels, and departments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Fee Types</option>
              {feeTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={16} />
            Add New Fee
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Fee Name</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Session</th>
              <th className="px-6 py-4 font-medium">Applicable Scope</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredFees.map(fee => (
              <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getIconForFee(fee.name)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{fee.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₦{fee.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fee.session}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {fee.programId ? (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs border border-blue-100">
                        {fee.programId}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">All Programs</span>
                    )}
                    {fee.levelId ? (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs border border-purple-100">
                        {fee.levelId}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">All Levels</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(fee)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(fee.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No fee configurations found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg animate-scale-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentFee.id ? 'Edit Fee Configuration' : 'New Fee Configuration'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Type</label>
                  <select
                    value={isCustomFee ? 'Other' : currentFee.name || ''}
                    onChange={e => {
                        const val = e.target.value;
                        if (val === 'Other') {
                            setIsCustomFee(true);
                            setCustomFeeName('');
                        } else {
                            setIsCustomFee(false);
                            setCurrentFee({...currentFee, name: val});
                        }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Fee Type...</option>
                    {feeTypes.map(t => (
                      <option key={t.id} value={t.label}>{t.label}</option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>
                
                {isCustomFee && (
                    <div className="col-span-2 animate-fade-in">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Fee Name</label>
                        <input 
                            type="text" 
                            value={customFeeName}
                            onChange={(e) => setCustomFeeName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Sports Development Levy"
                            required={isCustomFee}
                        />
                    </div>
                )}
                
                <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
                   <input 
                    type="number"
                    value={currentFee.amount || ''}
                    onChange={e => setCurrentFee({...currentFee, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                    min="0"
                    required
                   />
                </div>

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
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                   <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   >
                     <option value="First">First Semester</option>
                     <option value="Second">Second Semester</option>
                     <option value="Both">Both Semesters</option>
                   </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program</label>
                  <select
                    value={currentFee.programId || ''}
                    onChange={e => setCurrentFee({...currentFee, programId: e.target.value || null})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Programs</option>
                    {programmes.map(prog => (
                      <option key={prog.id} value={prog.name}>{prog.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                  <select
                    value={currentFee.levelId || ''}
                    onChange={e => setCurrentFee({...currentFee, levelId: e.target.value || null})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
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
                  <Save size={16} className="inline mr-2" />
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

export default FeeConfigurationPage;

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Filter, Search, BookOpen, HeartPulse, Home, FlaskConical, Wallet } from 'lucide-react';
import { useFinance, type FeeStructure } from '../../../../state/financeContext';

const FeeConfigurationPage: React.FC = () => {
  const { feeStructures, setFeeStructures } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<Partial<FeeStructure>>({});
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
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

  const getFeeTypeIdFromName = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('tuition')) return 'tuition';
    if (lower.includes('lab')) return 'lab';
    if (lower.includes('library') || lower.includes('book')) return 'library';
    if (lower.includes('medical') || lower.includes('health')) return 'medical';
    if (lower.includes('hostel') || lower.includes('accommodation')) return 'hostel';
    if (lower.includes('acceptance')) return 'acceptance';
    if (lower.includes('department')) return 'departmental';
    return 'custom';
  };

  const getTypeStyle = (typeId: string) => {
    switch (typeId) {
      case 'tuition': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'lab': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'library': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'medical': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'hostel': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'acceptance': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'departmental': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
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

  const filteredFees = feeStructures
    .filter(f => {
      const matchesType = filterType === 'All' || getFeeTypeIdFromName(f.name) === filterType;
      const matchesSearch = !searchTerm.trim() || f.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

  const totalFees = feeStructures.length;
  const totalAmount = feeStructures.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const mappedPrograms = feeStructures.filter(f => Boolean(f.programId)).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            Fee Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Set up and map fees to specific programs, levels, and departments.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
        >
          <Plus size={18} />
          Add New Fee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configured Fees</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalFees}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
              <Home size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mapped to Programs</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{mappedPrograms}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
              <FlaskConical size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totalAmount.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search fee name..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-[260px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            <option value="All">All Fee Types</option>
            {feeTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.length > 0 ? (
          filteredFees.map(fee => {
            const typeId = getFeeTypeIdFromName(fee.name);
            return (
              <div key={fee.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${
                  typeId === 'medical' ? 'bg-rose-500' : typeId === 'hostel' ? 'bg-amber-500' : typeId === 'lab' ? 'bg-purple-500' : 'bg-indigo-500'
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getTypeStyle(typeId)}`}>
                      {feeTypes.find(t => t.id === typeId)?.label || 'Custom'}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{fee.name}</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">ID: {fee.id.split('_').slice(-1)[0]}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    {getIconForFee(fee.name)}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Amount</span>
                    <span className="text-sm font-black text-indigo-600">₦{fee.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Session</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{fee.session}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {fee.programId ? (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-blue-50 text-blue-600 border-blue-100">
                          {fee.programId}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-gray-50 text-gray-500 border-gray-100">
                          All Programs
                        </span>
                      )}
                      {fee.levelId ? (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-purple-50 text-purple-600 border-purple-100">
                          Level {fee.levelId}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-gray-50 text-gray-500 border-gray-100">
                          All Levels
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(fee)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-all"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fee.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl text-[10px] font-black hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <Wallet size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Fee Configurations</h3>
            <p className="text-sm text-gray-500">Create a fee configuration to get started.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {currentFee.id ? 'Edit Fee Configuration' : 'New Fee Configuration'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl shadow-sm transition-all">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fee Type</label>
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
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                  >
                    <option value="">Select Fee Type...</option>
                    {feeTypes.map(t => (
                      <option key={t.id} value={t.label}>{t.label}</option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>
                
                {isCustomFee && (
                    <div className="md:col-span-2 animate-fade-in">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Custom Fee Name</label>
                        <input 
                            type="text" 
                            value={customFeeName}
                            onChange={(e) => setCustomFeeName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                            placeholder="e.g. Sports Development Levy"
                            required={isCustomFee}
                        />
                    </div>
                )}
                
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount (₦)</label>
                   <input 
                    type="number"
                    value={currentFee.amount || ''}
                    onChange={e => setCurrentFee({...currentFee, amount: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    required
                   />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Session</label>
                  <select
                    value={currentFee.session || ''}
                    onChange={e => setCurrentFee({...currentFee, session: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>

                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Semester</label>
                   <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                   >
                     <option value="First">First Semester</option>
                     <option value="Second">Second Semester</option>
                     <option value="Both">Both Semesters</option>
                   </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Program</label>
                  <select
                    value={currentFee.programId || ''}
                    onChange={e => setCurrentFee({...currentFee, programId: e.target.value || null})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                  >
                    <option value="">All Programs</option>
                    {programmes.map(prog => (
                      <option key={prog.id} value={prog.name}>{prog.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Level</label>
                  <select
                    value={currentFee.levelId || ''}
                    onChange={e => setCurrentFee({...currentFee, levelId: e.target.value || null})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
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

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
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

export default FeeConfigurationPage;

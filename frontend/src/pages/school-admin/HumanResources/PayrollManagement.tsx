import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  AlertCircle,
  Users,
  Edit2,
  X,
  UserX,
  Info,
  Check
} from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';
import { useFinance } from '../../../state/financeContext';
import type { SalaryStructure, StaffSalaryAssignment } from '../../../state/financeContext';

const PayrollManagement: React.FC = () => {
  const { designations, staff } = useHR();
  const { 
    salaryStructures, 
    setSalaryStructures, 
    staffSalaryAssignments,
    setStaffSalaryAssignments,
    setPayrollRuns
  } = useFinance();

  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newStructure, setNewStructure] = useState({
    name: '',
    designationId: '',
    baseSalary: 0,
    allowances: [{ name: 'Housing', amount: 0 }, { name: 'Transport', amount: 0 }],
    bonuses: [{ name: 'Performance', amount: 0 }],
    deductions: [{ name: 'Tax', amount: 0 }, { name: 'Pension', amount: 0 }]
  });

  // Track individual staff overrides/exclusions
  const [excludedStaffIds, setExcludedStaffIds] = useState<string[]>([]);
  const [staffPenalties, setStaffPenalties] = useState<Record<string, { name: string; amount: number }[]>>({});
  const [staffBonuses, setStaffBonuses] = useState<Record<string, { name: string; amount: number }[]>>({});
  const [staffBaseSalaries, setStaffBaseSalaries] = useState<Record<string, number>>({});

  // Memoized list of staff affected by current filters
  const affectedStaff = useMemo(() => {
    if (!newStructure.designationId) return [];
    
    return staff.filter(s => {
      const matchesDesignation = s.designationId === newStructure.designationId;
      return matchesDesignation;
    });
  }, [staff, newStructure.designationId]);

  const handleAddRow = (type: 'allowances' | 'bonuses' | 'deductions') => {
    setNewStructure(prev => ({
      ...prev,
      [type]: [...prev[type], { name: '', amount: 0 }]
    }));
  };

  const handleRemoveRow = (type: 'allowances' | 'bonuses' | 'deductions', index: number) => {
    setNewStructure(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (type: 'allowances' | 'bonuses' | 'deductions', index: number, field: 'name' | 'amount', value: string | number) => {
    setNewStructure(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleEdit = (structure: SalaryStructure) => {
    setEditingId(structure.id);
    
    // Find current assignments for this structure to see who is excluded/has penalties
    const assignments = staffSalaryAssignments.filter(a => a.salaryStructureId === structure.id);
    
    // We can't easily know who was "excluded" versus just not matching the designation 
    // unless we track the designation in the structure. 
    // For now, let's just populate the overrides for staff who HAVE assignments.
    const penalties: Record<string, { name: string; amount: number }[]> = {};
    const bonuses: Record<string, { name: string; amount: number }[]> = {};
    const baseSalaries: Record<string, number> = {};
    
    assignments.forEach(a => {
      if (a.customDeductions && a.customDeductions.length > 0) {
        penalties[a.staffId] = a.customDeductions;
      }
      if (a.customAllowances && a.customAllowances.length > 0) {
        bonuses[a.staffId] = a.customAllowances;
      }
      if (a.customBaseSalary !== undefined) {
        baseSalaries[a.staffId] = a.customBaseSalary;
      }
    });

    setStaffPenalties(penalties);
    setStaffBonuses(bonuses);
    setStaffBaseSalaries(baseSalaries);
    
    setNewStructure({
      name: structure.gradeLevel,
      designationId: '', 
      baseSalary: structure.baseSalary,
      allowances: structure.allowances.filter(a => !['Performance'].includes(a.name)),
      bonuses: structure.allowances.filter(a => ['Performance'].includes(a.name)),
      deductions: structure.deductions
    });
    
    setActiveView('edit');
  };

  const handleSaveStructure = () => {
    // If we're editing, we allow the designation to be empty as we might not be re-applying it 
    // to a whole group, or we might just be updating the structure itself.
    const isTargetValid = editingId || newStructure.designationId;

    if (!newStructure.name || !isTargetValid || newStructure.baseSalary <= 0) {
      alert('Please fill in all required fields (Name, Designation, and Base Salary)');
      return;
    }

    const structureId = editingId || `payroll_${crypto.randomUUID()}`;
    const formattedStructure: SalaryStructure = {
      id: structureId,
      gradeLevel: newStructure.name,
      baseSalary: newStructure.baseSalary,
      allowances: [...newStructure.allowances, ...newStructure.bonuses],
      deductions: newStructure.deductions
    };

    if (editingId) {
      setSalaryStructures(prev => prev.map(s => s.id === editingId ? formattedStructure : s));
    } else {
      setSalaryStructures(prev => [...prev, formattedStructure]);
    }
    
    // Apply to selected staff, respecting exclusions and penalties
    const staffToAssign = affectedStaff.filter(s => !excludedStaffIds.includes(s.id));
    
    const newAssignments: StaffSalaryAssignment[] = staffToAssign.map(s => ({
      staffId: s.id,
      salaryStructureId: structureId,
      customBaseSalary: staffBaseSalaries[s.id],
      customAllowances: staffBonuses[s.id] || [],
      customDeductions: staffPenalties[s.id] || []
    }));

    setStaffSalaryAssignments(prev => [
      ...prev.filter(a => !affectedStaff.some(s => s.id === a.staffId)), // Remove old assignments for all targeted staff
      ...newAssignments
    ]);

    alert(`Payroll structure ${editingId ? 'updated' : 'saved'} and applied to ${staffToAssign.length} staff members.`);
    resetForm();
  };

  const resetForm = () => {
    setActiveView('list');
    setEditingId(null);
    setExcludedStaffIds([]);
    setStaffPenalties({});
    setStaffBonuses({});
    setStaffBaseSalaries({});
    setNewStructure({
      name: '',
      designationId: '',
      baseSalary: 0,
      allowances: [{ name: 'Housing', amount: 0 }, { name: 'Transport', amount: 0 }],
      bonuses: [{ name: 'Performance', amount: 0 }],
      deductions: [{ name: 'Tax', amount: 0 }, { name: 'Pension', amount: 0 }]
    });
  };

  const forwardToFinance = (structure: SalaryStructure) => {
    const assignments = staffSalaryAssignments.filter(a => a.salaryStructureId === structure.id);
    
    if (assignments.length === 0) {
      alert('No staff members are assigned to this structure yet.');
      return;
    }

    const staffEntries = assignments.map(a => {
      const staffMember = staff.find(s => s.id === a.staffId);
      const base = a.customBaseSalary ?? structure.baseSalary;
      const allowances = (a.customAllowances ?? []).reduce((s, item) => s + item.amount, 0) + 
                        structure.allowances.reduce((s, item) => s + item.amount, 0);
      const deductions = (a.customDeductions ?? []).reduce((s, item) => s + item.amount, 0) + 
                        structure.deductions.reduce((s, item) => s + item.amount, 0);
      
      return {
        staffId: a.staffId,
        name: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown Staff',
        baseSalary: base,
        allowances,
        deductions,
        netPay: base + allowances - deductions
      };
    });

    const totalAmount = staffEntries.reduce((sum, entry) => sum + entry.netPay, 0);

    const now = new Date();
    const payrollRun = {
      id: `run_${crypto.randomUUID()}`,
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
      totalAmount,
      totalStaff: staffEntries.length,
      generatedBy: 'HR Admin', // Replace with actual user name
      status: 'Pending' as const,
      forwardedAt: now.toISOString(),
      staffEntries
    };

    setPayrollRuns(prev => [...prev, payrollRun]);
    alert(`Payroll for ${structure.gradeLevel} (${staffEntries.length} staff) has been forwarded to Finance.`);
  };

  const toggleStaffExclusion = (id: string) => {
    setExcludedStaffIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const addPenalty = (staffId: string) => {
    const penaltyName = prompt('Enter penalty/fine name:');
    const penaltyAmount = parseFloat(prompt('Enter amount (₦):') || '0');
    
    if (penaltyName && penaltyAmount > 0) {
      setStaffPenalties(prev => ({
        ...prev,
        [staffId]: [...(prev[staffId] || []), { name: penaltyName, amount: penaltyAmount }]
      }));
    }
  };

  const removePenalty = (staffId: string, idx: number) => {
    setStaffPenalties(prev => ({
      ...prev,
      [staffId]: prev[staffId].filter((_, i) => i !== idx)
    }));
  };

  const addBonus = (staffId: string) => {
    const bonusName = prompt('Enter bonus name:');
    const bonusAmount = parseFloat(prompt('Enter amount (₦):') || '0');
    
    if (bonusName && bonusAmount > 0) {
      setStaffBonuses(prev => ({
        ...prev,
        [staffId]: [...(prev[staffId] || []), { name: bonusName, amount: bonusAmount }]
      }));
    }
  };

  const removeBonus = (staffId: string, idx: number) => {
    setStaffBonuses(prev => ({
      ...prev,
      [staffId]: prev[staffId].filter((_, i) => i !== idx)
    }));
  };

  const editBaseSalary = (staffId: string) => {
    const currentBase = staffBaseSalaries[staffId] || newStructure.baseSalary;
    const newBase = parseFloat(prompt('Enter individual base salary (₦):', currentBase.toString()) || '0');
    
    if (newBase > 0) {
      setStaffBaseSalaries(prev => ({
        ...prev,
        [staffId]: newBase
      }));
    }
  };

  const removeBaseSalaryOverride = (staffId: string) => {
    setStaffBaseSalaries(prev => {
      const newState = { ...prev };
      delete newState[staffId];
      return newState;
    });
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Payroll Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure automated salary structures with custom staff-level overrides.
          </p>
        </div>
        <button
          onClick={() => activeView === 'list' ? setActiveView('create') : resetForm()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeView === 'list' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          {activeView === 'list' ? <><Plus size={18} /> Create Structure</> : 'Back to List'}
        </button>
      </div>

      {activeView === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salaryStructures.length > 0 ? (
            salaryStructures.map(struct => (
              <div key={struct.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{struct.gradeLevel}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                        Base: ₦{struct.baseSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(struct)}
                      className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:text-rose-600 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Components</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {struct.allowances.length} Allowances • {struct.deductions.length} Deductions
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-900 dark:text-white">Net Monthly</span>
                    <span className="text-lg font-black text-blue-600">
                      ₦{(struct.baseSalary + struct.allowances.reduce((acc, curr) => acc + curr.amount, 0) - struct.deductions.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => forwardToFinance(struct)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-xs font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-900/10"
                >
                  <Send size={14} /> Forward to Finance
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4">
                <AlertCircle size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Structures Found</h3>
              <p className="text-sm text-gray-500">Create a payroll structure to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-xl shadow-gray-200/30">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Info size={18} className="text-blue-600" /> General Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Structure Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Academic Level 10"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-bold"
                    value={newStructure.name}
                    onChange={e => setNewStructure(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Designation</label>
                  <select
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-bold appearance-none"
                    value={newStructure.designationId}
                    onChange={e => setNewStructure(prev => ({ ...prev, designationId: e.target.value }))}
                  >
                    <option value="">All Designations</option>
                    {designations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Monthly Salary (₦)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-bold text-blue-600"
                    value={newStructure.baseSalary || ''}
                    onChange={e => setNewStructure(prev => ({ ...prev, baseSalary: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-12">
                {/* Allowances Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                      <Plus size={14} className="text-emerald-600" /> Allowances
                    </h4>
                    <button onClick={() => handleAddRow('allowances')} className="text-[10px] font-black text-blue-600 hover:underline">+ Add Component</button>
                  </div>
                  <div className="space-y-3">
                    {newStructure.allowances.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Name"
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 text-xs font-bold"
                          value={item.name}
                          onChange={e => handleInputChange('allowances', idx, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          className="w-32 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 text-xs font-bold text-emerald-600"
                          value={item.amount || ''}
                          onChange={e => handleInputChange('allowances', idx, 'amount', parseFloat(e.target.value) || 0)}
                        />
                        <button onClick={() => handleRemoveRow('allowances', idx)} className="p-2 text-rose-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Deductions Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                      <Trash2 size={14} className="text-rose-600" /> Deductions
                    </h4>
                    <button onClick={() => handleAddRow('deductions')} className="text-[10px] font-black text-blue-600 hover:underline">+ Add Component</button>
                  </div>
                  <div className="space-y-3">
                    {newStructure.deductions.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Name"
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 text-xs font-bold"
                          value={item.name}
                          onChange={e => handleInputChange('deductions', idx, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          className="w-32 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 text-xs font-bold text-rose-600"
                          value={item.amount || ''}
                          onChange={e => handleInputChange('deductions', idx, 'amount', parseFloat(e.target.value) || 0)}
                        />
                        <button onClick={() => handleRemoveRow('deductions', idx)} className="p-2 text-rose-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={resetForm} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-xl text-xs font-black">Cancel</button>
                <button onClick={handleSaveStructure} className="px-10 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2">
                  <Save size={16} /> {editingId ? 'Update Structure' : 'Save & Assign'}
                </button>
              </div>
            </div>
          </div>

          {/* Affected Staff & Overrides Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-xl shadow-gray-200/30 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" /> Target Staff
                </h3>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg">
                  {affectedStaff.length - excludedStaffIds.length} Active
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Review staff members affected by current filters. You can exclude individuals or add specific penalties.
              </p>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {affectedStaff.length > 0 ? (
                  affectedStaff.map(s => {
                    const isExcluded = excludedStaffIds.includes(s.id);
                    const penalties = staffPenalties[s.id] || [];
                    const bonuses = staffBonuses[s.id] || [];
                    const customBase = staffBaseSalaries[s.id];
                    
                    return (
                      <div key={s.id} className={`p-4 rounded-2xl border transition-all ${isExcluded ? 'bg-gray-50 border-transparent opacity-50' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-[10px]">
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900 dark:text-white leading-none mb-1">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] text-gray-500 font-mono">{s.staffId}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!isExcluded && (
                              <>
                                <button onClick={() => editBaseSalary(s.id)} className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Edit Individual Base Salary">
                                  <DollarSign size={14} />
                                </button>
                                <button onClick={() => addBonus(s.id)} className="p-1.5 text-emerald-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors" title="Add Individual Bonus">
                                  <Plus size={14} />
                                </button>
                                <button onClick={() => addPenalty(s.id)} className="p-1.5 text-orange-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors" title="Add Fine/Penalty">
                                  <AlertCircle size={14} />
                                </button>
                              </>
                            )}
                            <button onClick={() => toggleStaffExclusion(s.id)} className={`p-1.5 rounded-lg transition-colors ${isExcluded ? 'text-emerald-500 hover:bg-emerald-50' : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50'}`} title={isExcluded ? 'Include Staff' : 'Exclude Staff'}>
                              {isExcluded ? <Check size={14} /> : <UserX size={14} />}
                            </button>
                          </div>
                        </div>

                        {!isExcluded && (
                          <div className="mt-3 space-y-2">
                            {/* Base Salary Override Display */}
                            {customBase !== undefined && (
                              <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 px-2 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">Custom Base Salary</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-blue-700">₦{customBase.toLocaleString()}</span>
                                  <button onClick={() => removeBaseSalaryOverride(s.id)} className="text-blue-300 hover:text-blue-500"><X size={10} /></button>
                                </div>
                              </div>
                            )}

                            {/* Bonuses Display */}
                            {bonuses.length > 0 && (
                              <div className="space-y-1">
                                {bonuses.map((b, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10 px-2 py-1 rounded-lg">
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">{b.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-emerald-700">+₦{b.amount.toLocaleString()}</span>
                                      <button onClick={() => removeBonus(s.id, idx)} className="text-emerald-300 hover:text-emerald-500"><X size={10} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Penalties Display */}
                            {penalties.length > 0 && (
                              <div className="space-y-1">
                                {penalties.map((p, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-rose-50/50 dark:bg-rose-900/10 px-2 py-1 rounded-lg">
                                    <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tight">{p.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-rose-700">-₦{p.amount.toLocaleString()}</span>
                                      <button onClick={() => removePenalty(s.id, idx)} className="text-rose-300 hover:text-rose-500"><X size={10} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching staff</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;

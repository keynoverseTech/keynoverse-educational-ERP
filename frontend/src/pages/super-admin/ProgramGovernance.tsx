import React, { useState, useMemo, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit2, 
  Globe, 
  Search,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import superAdminService from '../../services/superAdminApi';
import type { ProgramAssignmentData } from '../../services/superAdminApi';

// --- Interfaces ---

interface GlobalProgramme {
  id: string; // Assignment ID (from institution_programmes table)
  programmeId?: string; // Global Program ID (from programmes table)
  name: string;
  degreeType?: string;
  status?: 'active' | 'inactive';
  institutionId?: string;
  yearGranted?: string;
  accreditationStatus?: 'Approved' | 'Pending' | 'Expired';
  approvedStream?: string;
  expirationDate?: string;
  studentCapacity?: number;
}

interface Institution {
  id: string;
  name: string;
  location?: string;
}

const ProgramGovernance: React.FC = () => {
  const [programmes, setProgrammes] = useState<GlobalProgramme[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [availableGlobalPrograms, setAvailableGlobalPrograms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<GlobalProgramme>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch Institutions on mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await superAdminService.getInstitutions();
        const data = Array.isArray(response) ? response : (response as any).data || [];
        setInstitutions(data.map((i: any) => ({ id: i.id, name: i.name, location: i.address })));
      } catch (err) {
        console.error('Failed to fetch institutions', err);
      }
    };
    fetchInstitutions();
  }, []);

  // Fetch Programs when Institution is selected
  useEffect(() => {
    if (!selectedInstitutionId) {
      setProgrammes([]);
      return;
    }

    const fetchInstitutionPrograms = async () => {
      setIsLoading(true);
      try {
        const response = await superAdminService.getInstitutionPrograms(selectedInstitutionId);
        const data = Array.isArray(response) ? response : response.data || [];
        
        // Map API response to UI
        const mapped = data.map((p: any) => {
          return {
            id: p.id, // This is the unique Assignment ID
            programmeId: p.programme_id, // Store the global program ID separately
            
            // Try to match name from global list or fallback properties
            name: p.programme?.name || 
                  p.name || 
                  p.programme_name || 
                  p.title || 
                  (availableGlobalPrograms.find((gp: any) => gp.id === p.programme_id)?.name) ||
                  'Unknown Program',
            
            degreeType: p.programme?.type || p.degree_type || p.type || 'N/A',
            yearGranted: p.year_granted || p.date_granted?.split('-')[0],
            accreditationStatus: deriveAccreditationStatus(p),
            expirationDate: p.expiration_date,
            studentCapacity: p.capacity || p.student_capacity,
            institutionId: selectedInstitutionId,
            status: p.is_active ? 'active' : 'inactive',
            approvedStream: p.approved_stream || p.stream
          };
        });
        setProgrammes(mapped);
      } catch (err) {
        console.error('Failed to fetch institution programs', err);
        setProgrammes([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have global programs loaded (to ensure name mapping works)
    // or if we've tried loading them.
    if (availableGlobalPrograms.length > 0 || availableGlobalPrograms.length === 0) {
        fetchInstitutionPrograms();
    }
  }, [selectedInstitutionId, availableGlobalPrograms]);

  // Fetch Global Programs on mount (needed for mapping IDs to names)
  useEffect(() => {
    const fetchGlobalPrograms = async () => {
      try {
        const response = await superAdminService.getPrograms();
        const data = Array.isArray(response) ? response : (response as any).data || [];
        setAvailableGlobalPrograms(data);
      } catch (err) {
        console.error('Failed to fetch global programs', err);
      }
    };
    fetchGlobalPrograms();
  }, []);

  // --- Filtering ---
  const filteredProgrammes = useMemo(() => {
    return programmes.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [programmes, searchQuery]);

  // --- Handlers ---
  const normalizeAccreditationStatus = (
    value: GlobalProgramme['accreditationStatus']
  ): ProgramAssignmentData['accreditation_status'] => {
    if (value === 'Approved') return 'approved';
    if (value === 'Expired') return 'denied';
    return 'pending';
  };

  const deriveAccreditationStatus = (p: any) => {
    const raw = (p?.accreditation_status || p?.status || '').toString().toLowerCase();
    const expirationDate = p?.expiration_date ? new Date(p.expiration_date) : null;
    const isExpiredByDate = expirationDate ? expirationDate.getTime() < Date.now() : false;
    if (raw === 'denied' || raw === 'expired' || isExpiredByDate) return 'Expired' as const;
    if (raw === 'approved') return 'Approved' as const;
    return 'Pending' as const;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstitutionId) return;

    setIsSubmitting(true);
    try {
      if (!currentItem.id) { 
         // CREATE NEW ASSIGNMENT
         // We must have a selected programmeId
         if (!currentItem.programmeId) {
             alert('Please select a programme');
             setIsSubmitting(false);
             return;
         }

         const payload = {
           institution_id: selectedInstitutionId,
           programme_id: currentItem.programmeId,
           year_granted: parseInt(currentItem.yearGranted || '2024'),
           accreditation_status: normalizeAccreditationStatus(currentItem.accreditationStatus),
           capacity: currentItem.studentCapacity || 100,
           expiration_date: currentItem.expirationDate || '2030-01-01',
           is_active: true
         };
         
         await superAdminService.assignProgram(payload);
      } else {
          // UPDATE EXISTING ASSIGNMENT
          // Use the Assignment ID (currentItem.id)
          // Ensure we include institution_id and programme_id even for updates if required by validation
          if (!currentItem.programmeId) {
            alert('Programme is missing for this assignment');
            setIsSubmitting(false);
            return;
          }
          const payload = {
            institution_id: selectedInstitutionId,
            programme_id: currentItem.programmeId,
            year_granted: parseInt(currentItem.yearGranted || '2024'),
            accreditation_status: normalizeAccreditationStatus(currentItem.accreditationStatus),
            capacity: currentItem.studentCapacity || 100,
            expiration_date: currentItem.expirationDate,
            is_active: currentItem.status === 'active'
          };
          
          await superAdminService.updateInstitutionProgram(currentItem.id, payload);
      }
      
      // Refresh list
      // Re-trigger the fetch by toggling a dummy state or just calling fetch manually?
      // Since fetch is inside useEffect depending on ID, we can just call it if we extract it,
      // but simpler is to temporarily clear selection or just reload.
      // Better: Extract fetch logic or just reload page? No.
      // Let's just force a re-fetch by clearing programmes and letting useEffect run? No.
      // Let's just re-run the fetch logic manually here essentially.
      const response = await superAdminService.getInstitutionPrograms(selectedInstitutionId);
      // We need to re-map, but since the useEffect handles mapping when data changes... 
      // Actually, we can't easily trigger the useEffect re-run without changing dependencies.
      // So let's just duplicate the fetch+map logic briefly or reload window (bad UX).
      // Best way: trigger a counter or something.
      // For now, I'll just reload the window to be safe and simple, or better:
      // clear programmes and let user see it reload?
      // Let's just do a manual fetch and set state here.
      
      const data = Array.isArray(response) ? response : response.data || [];
      const mapped = data.map((p: any) => ({
            id: p.id,
            programmeId: p.programme_id,
            name: p.programme?.name || 
                  p.name || 
                  (availableGlobalPrograms.find((gp: any) => gp.id === p.programme_id)?.name) ||
                  'Unknown Program',
            degreeType: p.programme?.type || p.degree_type || 'N/A',
            yearGranted: p.year_granted,
            accreditationStatus: deriveAccreditationStatus(p),
            expirationDate: p.expiration_date,
            studentCapacity: p.capacity,
            institutionId: selectedInstitutionId,
            status: p.is_active ? 'active' : 'inactive',
            approvedStream: p.approved_stream
      }));
      setProgrammes(mapped);

      setIsModalOpen(false);
      setCurrentItem({});
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save program assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (prog: GlobalProgramme) => {
    if (!selectedInstitutionId || !prog.id) return;
    if (!prog.programmeId) {
      alert('Programme is missing for this assignment');
      return;
    }
    try {
      const nextIsActive = prog.status !== 'active';
      const payload = {
        institution_id: selectedInstitutionId,
        programme_id: prog.programmeId,
        year_granted: parseInt((prog.yearGranted || '2024').toString()),
        accreditation_status: normalizeAccreditationStatus(prog.accreditationStatus),
        capacity: prog.studentCapacity || 100,
        expiration_date: prog.expirationDate || '2030-01-01',
        is_active: nextIsActive,
      };
      await superAdminService.updateInstitutionProgram(prog.id, payload);
      setProgrammes(prev =>
        prev.map(p => (p.id === prog.id ? { ...p, status: nextIsActive ? 'active' : 'inactive' } : p))
      );
    } catch (err) {
      console.error('Failed to update programme status', err);
      alert('Failed to update programme status');
    }
  };

  const openAddModal = () => {
    if (!selectedInstitutionId) {
      return; 
    }
    setCurrentItem({
      institutionId: selectedInstitutionId,
      // id is undefined -> implies NEW
      programmeId: '', // Start with empty selection
      degreeType: 'HND',
      status: 'active',
      accreditationStatus: 'Approved'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Globe className="text-blue-600" size={28} />
            Program Governance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage academic programmes and accreditation for institutions.
          </p>
        </div>
      </div>

      {/* Institution Selection & Actions Bar */}
      <div className="bg-white dark:bg-[#151e32] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Institution Selector */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 min-w-fit">
            <Building2 size={20} className="text-blue-500" />
            <span className="text-sm font-bold whitespace-nowrap">Select Institution:</span>
          </div>
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedInstitutionId}
              onChange={(e) => setSelectedInstitutionId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">-- Select an Institution to Manage --</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.location || 'N/A'})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Search & Add */}
        <div className="flex items-center gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedInstitutionId}
              className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button 
            onClick={openAddModal}
            disabled={!selectedInstitutionId}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Plus size={18} />
            <span>Add Programme</span>
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      {!selectedInstitutionId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-[#151e32]/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="p-4 bg-white dark:bg-[#151e32] rounded-full shadow-sm mb-4">
            <Building2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Institution Selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md text-center">
            Please select an institution from the dropdown above to view and manage its academic programmes.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-500">Loading programmes...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Programme Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Year Granted</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Accreditation</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProgrammes.length > 0 ? (
                filteredProgrammes.map(prog => (
                  <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group text-xs">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{prog.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">{prog.degreeType}</span>
                            {prog.approvedStream && (
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-[9px] font-bold">
                                {prog.approvedStream}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                        <Calendar size={14} className="text-gray-400" />
                        {prog.yearGranted || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {prog.status !== 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <ToggleLeft size={10} />
                            Disabled
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${
                            prog.accreditationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                            prog.accreditationStatus === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                          }`}>
                            {prog.accreditationStatus === 'Approved' ? <CheckCircle2 size={10} /> : 
                             prog.accreditationStatus === 'Expired' ? <XCircle size={10} /> : <AlertTriangle size={10} />}
                            {prog.accreditationStatus}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">Exp: {prog.expirationDate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users size={14} />
                        <span className="font-bold">{prog.studentCapacity || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setCurrentItem(prog); setIsModalOpen(true); }}
                          className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleToggleActive(prog)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prog.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {prog.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <GraduationCap size={24} className="text-gray-300 dark:text-gray-600" />
                      <p>No programmes found for this institution.</p>
                      <button 
                        onClick={openAddModal}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Create the first one
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {currentItem?.id ? 'Edit' : 'Add New'} Programme
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {institutions.find(i => i.id === selectedInstitutionId)?.name}
              </p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Programme Name</label>
                  {!currentItem?.id ? (
                    <select
                      required
                      value={currentItem?.programmeId || ''}
                      onChange={e => {
                        const prog = availableGlobalPrograms.find(p => p.id === e.target.value);
                        setCurrentItem({
                          ...currentItem, 
                          programmeId: e.target.value, 
                          name: prog?.name,
                          degreeType: prog?.type
                        });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="">Select a Program</option>
                      {availableGlobalPrograms.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text"
                      readOnly
                      value={currentItem?.name || ''}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Degree Type</label>
                    <input 
                      type="text"
                      required
                      value={currentItem?.degreeType || ''}
                      onChange={e => setCurrentItem({...currentItem, degreeType: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="e.g. HND"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Year Granted</label>
                    <input 
                      type="text"
                      required
                      value={currentItem?.yearGranted || ''}
                      onChange={e => setCurrentItem({...currentItem, yearGranted: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="e.g. 2023"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Approved Stream</label>
                  <input 
                    type="text"
                    required
                    value={currentItem?.approvedStream || ''}
                    onChange={e => setCurrentItem({...currentItem, approvedStream: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    placeholder="e.g. Stream A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Accreditation</label>
                    <select 
                      value={currentItem?.accreditationStatus || 'Approved'}
                      onChange={e => setCurrentItem({...currentItem, accreditationStatus: e.target.value as NonNullable<GlobalProgramme['accreditationStatus']>})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Capacity</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={currentItem?.studentCapacity || ''}
                      onChange={e => setCurrentItem({...currentItem, studentCapacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Expiration Date</label>
                  <input 
                    type="date"
                    required
                    value={currentItem?.expirationDate || ''}
                    onChange={e => setCurrentItem({...currentItem, expirationDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramGovernance;

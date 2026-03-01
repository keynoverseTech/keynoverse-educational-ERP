import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  Globe, 
  Search,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

// --- Interfaces ---

interface GlobalProgramme {
  id: string;
  name: string;
  degreeType: string;
  status: 'active' | 'inactive';
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
  location: string;
}

// --- Mock Data ---

const mockInstitutions: Institution[] = [
  { id: 'inst-1', name: 'Global Heights Academy', location: 'New York, USA' },
  { id: 'inst-2', name: 'Tech Institute of Technology', location: 'California, USA' },
  { id: 'inst-3', name: 'City University', location: 'London, UK' },
];

const initialProgrammes: GlobalProgramme[] = [
  { 
    id: 'gp-1', 
    name: 'HND Computer Engineering', 
    degreeType: 'HND', 
    status: 'active',
    institutionId: 'inst-1',
    yearGranted: '2023',
    accreditationStatus: 'Approved',
    approvedStream: 'Stream A',
    expirationDate: '2028-12-31',
    studentCapacity: 120
  },
  { 
    id: 'gp-2', 
    name: 'HND Biochemistry', 
    degreeType: 'HND', 
    status: 'active',
    institutionId: 'inst-1',
    yearGranted: '2022',
    accreditationStatus: 'Approved',
    approvedStream: 'General',
    expirationDate: '2027-06-30',
    studentCapacity: 80
  },
];

const ProgramGovernance: React.FC = () => {
  const [programmes, setProgrammes] = useState<GlobalProgramme[]>(initialProgrammes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GlobalProgramme>>({});

  // --- Filtering ---
  const filteredProgrammes = useMemo(() => {
    let result = programmes;
    if (selectedInstitutionId) {
      result = result.filter(p => p.institutionId === selectedInstitutionId);
    } else {
      // If no institution is selected, show nothing or all? 
      // User said: "make sure the fillter so be done be for add a program"
      // and "search for the insitude we want to create the programmes for"
      // It feels cleaner to only show programmes when an institution is selected, 
      // acting as a true filter/context.
      return []; 
    }
    return result.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [programmes, searchQuery, selectedInstitutionId]);

  // --- Handlers ---
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItem?.id) {
      setProgrammes(programmes.map(p => p.id === currentItem.id ? { ...p, ...currentItem } as GlobalProgramme : p));
    } else {
      const newProg: GlobalProgramme = {
        ...currentItem as GlobalProgramme,
        id: `gp-${Date.now()}`,
        institutionId: selectedInstitutionId,
        status: 'active'
      };
      setProgrammes([...programmes, newProg]);
    }
    setIsModalOpen(false);
    setCurrentItem({});
  };

  const handleDelete = (id: string) => {
    setProgrammes(programmes.filter(p => p.id !== id));
  };

  const openAddModal = () => {
    if (!selectedInstitutionId) {
      return; 
    }
    setCurrentItem({
      institutionId: selectedInstitutionId,
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
              {mockInstitutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.location})</option>
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
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${
                          prog.accreditationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                          prog.accreditationStatus === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          {prog.accreditationStatus === 'Approved' ? <CheckCircle2 size={10} /> : 
                           prog.accreditationStatus === 'Expired' ? <XCircle size={10} /> : <AlertTriangle size={10} />}
                          {prog.accreditationStatus}
                        </span>
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
                          onClick={() => handleDelete(prog.id)}
                          className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                        >
                          <Trash2 size={14} />
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
                {mockInstitutions.find(i => i.id === selectedInstitutionId)?.name}
              </p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Programme Name</label>
                  <input 
                    type="text"
                    required
                    value={currentItem?.name || ''}
                    onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    placeholder="e.g. HND Computer Science"
                  />
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Save Programme
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

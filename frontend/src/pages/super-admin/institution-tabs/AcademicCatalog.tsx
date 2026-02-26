import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search,
  MoreVertical,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// --- Interfaces ---

interface Programme {
  id: string;
  name: string;
  degreeType: string;
  status: 'active' | 'inactive';
  yearGranted?: string;
  accreditationStatus?: 'Approved' | 'Pending' | 'Expired';
  approvedStream?: string;
  expirationDate?: string;
  studentCapacity?: number;
}

// --- Mock Data ---

const initialProgrammes: Programme[] = [
  { 
    id: 'gp-1', 
    name: 'B.Eng Computer Engineering', 
    degreeType: 'B.Eng', 
    status: 'active',
    yearGranted: '2023',
    accreditationStatus: 'Approved',
    approvedStream: 'Stream A',
    expirationDate: '2028-12-31',
    studentCapacity: 120
  },
  { 
    id: 'gp-2', 
    name: 'B.Sc Biochemistry', 
    degreeType: 'B.Sc', 
    status: 'active',
    yearGranted: '2022',
    accreditationStatus: 'Approved',
    approvedStream: 'General',
    expirationDate: '2027-06-30',
    studentCapacity: 80
  },
];

const AcademicCatalog: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>(initialProgrammes);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleStatus = (id: string) => {
    setProgrammes(programmes.map(prog => 
      prog.id === id 
        ? { ...prog, status: prog.status === 'active' ? 'inactive' : 'active' } 
        : prog
    ));
  };

  const filteredProgrammes = programmes.filter(prog => 
    prog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-2xl flex gap-4 items-start">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">Program Governance</h4>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
            Manage which programmes are active for this institution. Add, edit, or remove programmes specific to this institution.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search programmes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white w-full"
          />
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          Add Programme
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProgrammes.map((prog) => (
          <div key={prog.id} className="bg-white dark:bg-[#151e32] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{prog.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">{prog.degreeType}</span>
                  {prog.approvedStream && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-[9px] font-bold">
                      {prog.approvedStream}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                 <p className="text-[10px] text-gray-400 uppercase font-bold">Granted</p>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{prog.yearGranted || 'N/A'}</p>
              </div>

              <div className="flex flex-col items-center">
                 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit mb-1 ${
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

              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical size={16} />
              </button>
              
              <button 
                onClick={() => handleToggleStatus(prog.id)}
                className={`w-10 h-5 rounded-full p-1 transition-colors ${
                  prog.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                title={prog.status === 'active' ? 'Disable Programme' : 'Enable Programme'}
              >
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
                  prog.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProgrammes.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No programmes found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default AcademicCatalog;

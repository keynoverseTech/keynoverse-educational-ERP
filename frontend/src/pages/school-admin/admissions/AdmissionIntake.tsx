import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause, 
  XCircle, 
  Plus, 
  History,
  MoreHorizontal,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

// --- Types ---

type AdmissionMode = 'UTME' | 'Direct Entry';

interface Intake {
  id: string;
  name: string;
  academicSession: string;
  modes: AdmissionMode[];
  startDate: string;
  endDate: string;
  status: 'Open' | 'Closed' | 'Paused';
  applicationCount: number;
  allowImmediate: boolean;
  autoClose: boolean;
}

// --- Mock Data ---

const initialIntakes: Intake[] = [
  {
    id: '1',
    name: '2023/2024 UTME Admission',
    academicSession: '2023/2024',
    modes: ['UTME', 'Direct Entry'],
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    status: 'Closed',
    applicationCount: 1250,
    allowImmediate: true,
    autoClose: true
  },
  {
    id: '2',
    name: '2022/2023 Supplementary',
    academicSession: '2022/2023',
    modes: ['UTME'],
    startDate: '2023-02-01',
    endDate: '2023-04-15',
    status: 'Closed',
    applicationCount: 450,
    allowImmediate: true,
    autoClose: true
  }
];

const AdmissionIntake: React.FC = () => {
  // --- State ---
  const [intakes, setIntakes] = useState<Intake[]>(initialIntakes);
  const [activeIntake, setActiveIntake] = useState<Intake | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    academicSession: '2025/2026',
    name: '',
    modes: { utme: true, directEntry: true },
    startDate: '',
    endDate: '',
    allowImmediate: true,
    autoClose: true
  });

  // Derived State for Countdown
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Check for active intake on load
  useEffect(() => {
    const active = intakes.find(i => i.status === 'Open' || i.status === 'Paused');
    setActiveIntake(active || null);
  }, [intakes]);

  // Countdown Timer Logic
  useEffect(() => {
    if (!activeIntake || activeIntake.status !== 'Open') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(activeIntake.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Expired');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeIntake]);

  // --- Handlers ---

  const handleOpenNewIntake = () => {
    const modes: AdmissionMode[] = [];
    if (formData.modes.utme) modes.push('UTME');
    if (formData.modes.directEntry) modes.push('Direct Entry');

    const newIntake: Intake = {
      id: Date.now().toString(),
      name: formData.name,
      academicSession: formData.academicSession,
      modes,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'Open',
      applicationCount: 0,
      allowImmediate: formData.allowImmediate,
      autoClose: formData.autoClose
    };

    setIntakes([newIntake, ...intakes]);
    setActiveIntake(newIntake);
    setIsModalOpen(false);
  };

  const handleCloseIntake = () => {
    if (!activeIntake) return;
    const updatedIntakes = intakes.map(i => 
      i.id === activeIntake.id ? { ...i, status: 'Closed' as const } : i
    );
    setIntakes(updatedIntakes);
    setActiveIntake(null);
  };

  const handlePauseIntake = () => {
    if (!activeIntake) return;
    const newStatus: 'Open' | 'Paused' = activeIntake.status === 'Paused' ? 'Open' : 'Paused';
    const updatedIntakes = intakes.map(i => 
      i.id === activeIntake.id ? { ...i, status: newStatus } : i
    );
    setIntakes(updatedIntakes);
    // Optimistic update for smoother UI
    setActiveIntake({ ...activeIntake, status: newStatus }); 
  };

  // --- Render Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Closed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* --- Page Header --- */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Admission Intake
            {activeIntake?.status === 'Open' && (
              <span className="animate-pulse flex h-3 w-3 rounded-full bg-green-500"></span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Control application periods for new student intakes
          </p>
        </div>
      </div>

      {/* --- Intake Status Card --- */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Status Indicator */}
            <div className="flex items-center gap-6">
              <div className={`
                w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2
                ${activeIntake?.status === 'Open' 
                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                  : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}
              `}>
                {activeIntake?.status === 'Open' ? (
                  <>
                    <CheckCircle size={32} />
                    <span className="font-bold text-sm uppercase tracking-wider">Open</span>
                  </>
                ) : (
                  <>
                    <XCircle size={32} />
                    <span className="font-bold text-sm uppercase tracking-wider">Closed</span>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {activeIntake ? activeIntake.academicSession : 'No Active Intake'}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {activeIntake ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        <span>Started: {new Date(activeIntake.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>Ends: {new Date(activeIntake.endDate).toLocaleDateString()}</span>
                      </div>
                    </>
                  ) : (
                    <span>Admissions are currently closed. Open a new intake to begin.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action */}
            {!activeIntake && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Plus size={20} />
                Open New Intake
              </button>
            )}
          </div>
        </div>

        {/* --- Active Intake Management --- */}
        {activeIntake && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Countdown */}
              <div className="flex items-center gap-4 bg-white dark:bg-[#151e32] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Remaining</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">{timeLeft}</p>
                </div>
              </div>

              {/* Application Count */}
              <div className="flex items-center gap-4 bg-white dark:bg-[#151e32] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
                  <ArrowRight size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Applications Received</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{activeIntake.applicationCount}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                 <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Extend Date
                </button>
                <button 
                  onClick={handlePauseIntake}
                  className="px-4 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors flex items-center gap-2"
                >
                  {activeIntake.status === 'Paused' ? <Play size={16} /> : <Pause size={16} />}
                  {activeIntake.status === 'Paused' ? 'Resume' : 'Pause'}
                </button>
                <button 
                  onClick={handleCloseIntake}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Close Intake
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Historical Intakes Table --- */}
      <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <History size={20} className="text-gray-400" />
            Intake History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intake Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modes</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {intakes.map((intake) => (
                <tr key={intake.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{intake.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{intake.academicSession}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">
                      {intake.modes.map(mode => (
                        <span key={mode} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-md border border-gray-200 dark:border-gray-700">
                          {mode}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(intake.startDate).toLocaleDateString()} - {new Date(intake.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(intake.status)}`}>
                      {intake.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Open New Intake Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Open New Intake</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Academic Session */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Session
                </label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.academicSession}
                  onChange={(e) => setFormData({...formData, academicSession: e.target.value})}
                >
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                </select>
              </div>

              {/* Intake Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intake Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 2025/2026 UTME Admission"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Admission Modes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admission Modes
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.modes.utme}
                      onChange={(e) => setFormData({
                        ...formData, 
                        modes: { ...formData.modes, utme: e.target.checked }
                      })}
                    />
                    <span className="text-gray-700 dark:text-gray-300">UTME</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.modes.directEntry}
                      onChange={(e) => setFormData({
                        ...formData, 
                        modes: { ...formData.modes, directEntry: e.target.checked }
                      })}
                    />
                    <span className="text-gray-700 dark:text-gray-300">Direct Entry</span>
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Allow applications immediately
                  </span>
                  <div className={`w-11 h-6 rounded-full p-1 transition-colors ${formData.allowImmediate ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.allowImmediate ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={formData.allowImmediate}
                    onChange={(e) => setFormData({...formData, allowImmediate: e.target.checked})}
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Auto-close when end date is reached
                  </span>
                  <div className={`w-11 h-6 rounded-full p-1 transition-colors ${formData.autoClose ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.autoClose ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={formData.autoClose}
                    onChange={(e) => setFormData({...formData, autoClose: e.target.checked})}
                  />
                </label>
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <ShieldAlert className="shrink-0" size={20} />
                <p>Opening this intake will automatically enable the public application portal for the selected academic session.</p>
              </div>

            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleOpenNewIntake}
                disabled={!formData.name || !formData.startDate || !formData.endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Activate Intake
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmissionIntake;

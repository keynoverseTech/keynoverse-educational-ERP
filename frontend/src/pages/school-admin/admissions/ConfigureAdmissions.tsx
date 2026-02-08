import React, { useState } from 'react';
import { 
  Calendar, 
  Settings, 
  List, 
  FileText, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Upload,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

// --- Types ---
interface AdmissionSession {
  academicSession: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Closed';
}

interface AdmissionMode {
  id: string;
  name: string;
  enabled: boolean;
  requireScreening: boolean;
  allowManualOverride: boolean;
}

interface ProgrammeCutOff {
  id: string;
  programme: string;
  entryLevel: number;
  minUtmeScore: number;
}

interface AdmissionPolicies {
  requirePostUtme: boolean;
  allowBelowCutoff: boolean;
  rollingAdmission: boolean;
  notes: string;
}

// --- Mock Data ---
const initialSession: AdmissionSession = {
  academicSession: '2024/2025',
  startDate: '2024-08-01',
  endDate: '2025-01-31',
  status: 'Active'
};

const initialModes: AdmissionMode[] = [
  { id: 'utme', name: 'UTME (JAMB)', enabled: true, requireScreening: true, allowManualOverride: false },
  { id: 'de', name: 'Direct Entry', enabled: true, requireScreening: true, allowManualOverride: true },
  { id: 'transfer', name: 'Transfer', enabled: false, requireScreening: true, allowManualOverride: false },
];

const initialCutOffs: ProgrammeCutOff[] = [
  { id: '1', programme: 'Computer Science', entryLevel: 100, minUtmeScore: 200 },
  { id: '2', programme: 'Accounting', entryLevel: 100, minUtmeScore: 180 },
  { id: '3', programme: 'Medicine & Surgery', entryLevel: 100, minUtmeScore: 250 },
  { id: '4', programme: 'Mass Communication', entryLevel: 100, minUtmeScore: 190 },
];

const initialPolicies: AdmissionPolicies = {
  requirePostUtme: true,
  allowBelowCutoff: false,
  rollingAdmission: true,
  notes: 'All candidates must meet the minimum O-Level requirements before being considered for admission.'
};

const ConfigureAdmissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'session' | 'modes' | 'cutoffs' | 'policies'>('session');
  
  const [session, setSession] = useState<AdmissionSession>(initialSession);
  const [modes, setModes] = useState<AdmissionMode[]>(initialModes);
  const [cutOffs, setCutOffs] = useState<ProgrammeCutOff[]>(initialCutOffs);
  const [policies, setPolicies] = useState<AdmissionPolicies>(initialPolicies);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Add Rule Modal State
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ProgrammeCutOff>>({
    programme: '',
    entryLevel: 100,
    minUtmeScore: 180
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleModeToggle = (id: string, field: keyof Pick<AdmissionMode, 'enabled' | 'requireScreening' | 'allowManualOverride'>) => {
    setModes(modes.map(mode => {
      if (mode.id === id) {
        return { ...mode, [field]: !mode[field] };
      }
      return mode;
    }));
  };

  const handleSaveRule = () => {
    if (!newRule.programme || !newRule.entryLevel || !newRule.minUtmeScore) return;
    
    const rule: ProgrammeCutOff = {
      id: Math.random().toString(36).substr(2, 9),
      programme: newRule.programme,
      entryLevel: Number(newRule.entryLevel),
      minUtmeScore: Number(newRule.minUtmeScore)
    };
    
    setCutOffs([...cutOffs, rule]);
    setNewRule({ programme: '', entryLevel: 100, minUtmeScore: 180 });
    setIsAddRuleModalOpen(false);
  };

  const renderAddRuleModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Cut-Off Rule</h3>
          <button 
            onClick={() => setIsAddRuleModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Programme</label>
            <input 
              type="text"
              value={newRule.programme}
              onChange={(e) => setNewRule({...newRule, programme: e.target.value})}
              placeholder="e.g. Computer Science"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Entry Level</label>
              <select 
                value={newRule.entryLevel}
                onChange={(e) => setNewRule({...newRule, entryLevel: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min. UTME Score</label>
              <input 
                type="number"
                value={newRule.minUtmeScore}
                onChange={(e) => setNewRule({...newRule, minUtmeScore: Number(e.target.value)})}
                min={0}
                max={400}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <button 
            onClick={() => setIsAddRuleModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveRule}
            disabled={!newRule.programme}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );

  const renderSessionTab = () => (
    <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Session</label>
          <select 
            value={session.academicSession}
            onChange={(e) => setSession({...session, academicSession: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input 
              type="date" 
              value={session.startDate}
              onChange={(e) => setSession({...session, startDate: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input 
              type="date" 
              value={session.endDate}
              onChange={(e) => setSession({...session, endDate: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Admission Status</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Control whether new applications can be submitted</p>
          </div>
          <button 
            onClick={() => setSession({...session, status: session.status === 'Active' ? 'Closed' : 'Active'})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              session.status === 'Active' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${
                session.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              <CheckCircle size={20} />
            ) : (
              <Save size={20} />
            )}
            {showSuccess ? 'Saved Successfully' : 'Save Session'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderModesTab = () => (
    <div className="space-y-6">
      {modes.map((mode) => (
        <div key={mode.id} className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                checked={mode.enabled}
                onChange={() => handleModeToggle(mode.id, 'enabled')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{mode.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable this admission channel</p>
              </div>
            </div>
          </div>

          {mode.enabled && (
            <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Screening</span>
                <button 
                  onClick={() => handleModeToggle(mode.id, 'requireScreening')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    mode.requireScreening ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mode.requireScreening ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Manual Override</span>
                  {mode.allowManualOverride && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                      <AlertTriangle size={10} /> Risky
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleModeToggle(mode.id, 'allowManualOverride')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    mode.allowManualOverride ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mode.allowManualOverride ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
          Save Modes
        </button>
      </div>
    </div>
  );

  const renderCutOffsTab = () => (
    <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Programme Cut-Off Marks</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Define minimum UTME scores for each programme</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Upload size={16} /> Bulk Upload
          </button>
          <button 
            onClick={() => setIsAddRuleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Entry Level</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Min. UTME Score</th>
              <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {cutOffs.map((cutoff) => (
              <tr key={cutoff.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cutoff.programme}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{cutoff.entryLevel}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    cutoff.minUtmeScore >= 200 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {cutoff.minUtmeScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPoliciesTab = () => (
    <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Require Post-UTME</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mandatory screening exam for all applicants</p>
            </div>
            <button 
              onClick={() => setPolicies({...policies, requirePostUtme: !policies.requirePostUtme})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                policies.requirePostUtme ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                policies.requirePostUtme ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Allow Below Cut-off</h4>
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                  <AlertTriangle size={10} /> High Risk
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Permit admission for students below cut-off (requires VC approval)</p>
            </div>
            <button 
              onClick={() => setPolicies({...policies, allowBelowCutoff: !policies.allowBelowCutoff})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                policies.allowBelowCutoff ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                policies.allowBelowCutoff ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Rolling Admission</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Process admissions in batches as they come in</p>
            </div>
            <button 
              onClick={() => setPolicies({...policies, rollingAdmission: !policies.rollingAdmission})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                policies.rollingAdmission ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                policies.rollingAdmission ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policy Notes</label>
          <textarea 
            value={policies.notes}
            onChange={(e) => setPolicies({...policies, notes: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder="Enter additional policy details..."
          />
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
            Save Policies
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configure Admissions</h1>
          <p className="text-gray-500 dark:text-gray-400">Set admission rules and policies for the current session</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#151e32] px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <Calendar size={16} />
          <span>Active Session: <span className="font-semibold text-gray-900 dark:text-white">2024/2025</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('session')}
            className={`px-4 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'session' 
                ? 'bg-white dark:bg-[#151e32] text-blue-600 border-x border-t border-gray-200 dark:border-gray-700 -mb-px' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Calendar size={18} /> Admission Session
          </button>
          <button 
            onClick={() => setActiveTab('modes')}
            className={`px-4 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'modes' 
                ? 'bg-white dark:bg-[#151e32] text-blue-600 border-x border-t border-gray-200 dark:border-gray-700 -mb-px' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Settings size={18} /> Admission Modes
          </button>
          <button 
            onClick={() => setActiveTab('cutoffs')}
            className={`px-4 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'cutoffs' 
                ? 'bg-white dark:bg-[#151e32] text-blue-600 border-x border-t border-gray-200 dark:border-gray-700 -mb-px' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <List size={18} /> Programme Cut-Offs
          </button>
          <button 
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'policies' 
                ? 'bg-white dark:bg-[#151e32] text-blue-600 border-x border-t border-gray-200 dark:border-gray-700 -mb-px' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FileText size={18} /> Admission Policies
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'session' && renderSessionTab()}
        {activeTab === 'modes' && renderModesTab()}
        {activeTab === 'cutoffs' && renderCutOffsTab()}
        {activeTab === 'policies' && renderPoliciesTab()}
      </div>

      {isAddRuleModalOpen && renderAddRuleModal()}
    </div>
  );
};

export default ConfigureAdmissions;

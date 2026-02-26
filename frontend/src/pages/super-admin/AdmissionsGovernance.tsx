import React, { useState } from 'react';
import { 
  Shield, 
  Settings, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Layers, 
  FileText, 
  GitMerge, 
  Eye, 
  EyeOff,
  CheckCircle,
  Plus,
  Trash2,
  GripVertical,
  Info
} from 'lucide-react';

// --- Governance Types ---
type ConfigSource = 'Default' | 'School' | 'Overridden' | 'Locked';

interface GovernanceControl<T> {
  value: T;
  source: ConfigSource;
  isLocked: boolean;
}

// --- Centralized Admissions Super Admin Config ---
const initialGovernanceConfig = {
  session: {
    academicSession: { value: '2024/2025', source: 'Default' as ConfigSource, isLocked: false },
    admissionStatus: { value: 'Active', source: 'School' as ConfigSource, isLocked: false }
  },
  modes: [
    { id: 'utme', name: 'UTME (JAMB)', enabled: { value: true, source: 'Default' as ConfigSource, isLocked: true }, requireScreening: { value: true, source: 'Default' as ConfigSource, isLocked: false } },
    { id: 'de', name: 'Direct Entry', enabled: { value: true, source: 'School' as ConfigSource, isLocked: false }, requireScreening: { value: true, source: 'Default' as ConfigSource, isLocked: false } },
    { id: 'transfer', name: 'Transfer', enabled: { value: false, source: 'Overridden' as ConfigSource, isLocked: true }, requireScreening: { value: true, source: 'Default' as ConfigSource, isLocked: false } },
  ],
  policies: {
    requirePostUtme: { value: true, source: 'Default' as ConfigSource, isLocked: false },
    allowBelowCutoff: { value: false, source: 'Locked' as ConfigSource, isLocked: true },
    rollingAdmission: { value: true, source: 'School' as ConfigSource, isLocked: false }
  },
  formFields: [
    { id: 'name', label: 'Full Name', type: 'text', required: { value: true, source: 'Locked', isLocked: true }, hidden: { value: false, source: 'Default', isLocked: true }, locked: true },
    { id: 'email', label: 'Email Address', type: 'email', required: { value: true, source: 'Default', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: { value: false, source: 'School', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
    { id: 'jambNo', label: 'JAMB Reg Number', type: 'text', required: { value: true, source: 'Locked', isLocked: true }, hidden: { value: false, source: 'Default', isLocked: true }, locked: true },
    { id: 'score', label: 'UTME Score', type: 'number', required: { value: true, source: 'Default', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
    { id: 'course', label: 'Course of Study', type: 'text', required: { value: true, source: 'Default', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
    { id: 'dob', label: 'Date of Birth', type: 'date', required: { value: true, source: 'Default', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
    { id: 'gender', label: 'Gender', type: 'select', required: { value: true, source: 'Default', isLocked: false }, hidden: { value: false, source: 'Default', isLocked: false }, locked: false },
  ],
  workflow: [
    { id: '1', name: 'Application Submission', role: 'Applicant', order: 1, isLocked: true },
    { id: '2', name: 'Document Verification', role: 'Admissions Officer', order: 2, isLocked: false },
    { id: '3', name: 'Academic Screening', role: 'Department HOD', order: 3, isLocked: false },
    { id: '4', name: 'Final Approval', role: 'Registrar', order: 4, isLocked: false },
    { id: '5', name: 'Enrollment', role: 'System', order: 5, isLocked: true },
  ]
};

const AdmissionsGovernance: React.FC = () => {
  const [config] = useState(initialGovernanceConfig);
  const [activeTab, setActiveTab] = useState<'overview' | 'form' | 'workflow' | 'policies'>('overview');

  const handleToggleLock = (path: string) => {
    console.log(`Super Admin: Toggling lock for ${path}`);
    // Simulated toggle logic
  };

  const handleValueChange = (path: string, newValue: any) => {
    console.log(`Super Admin: Overriding ${path} to`, newValue);
    // Simulated change logic
  };

  const getSourceBadge = (source: ConfigSource) => {
    const styles = {
      Default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      School: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      Overridden: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      Locked: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[source]}`}>
        {source}
      </span>
    );
  };

  const GovernanceRow = ({ label, control, onToggle, onChange, description }: { 
    label: string, 
    control: GovernanceControl<any>, 
    onToggle: () => void, 
    onChange: (val: any) => void,
    description?: string 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#151e32] border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition-all group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{label}</h4>
          {getSourceBadge(control.source)}
        </div>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Value Control */}
        <div className="flex items-center">
          {typeof control.value === 'boolean' ? (
            <button 
              onClick={() => onChange(!control.value)}
              disabled={control.isLocked}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                control.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              } ${control.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                control.value ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          ) : (
            <input 
              type="text" 
              value={control.value} 
              onChange={(e) => onChange(e.target.value)}
              disabled={control.isLocked}
              className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white disabled:opacity-50"
            />
          )}
        </div>

        {/* Lock/Reset Controls */}
        <div className="flex items-center gap-1 border-l border-gray-100 dark:border-gray-800 pl-4">
          <button 
            onClick={onToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              control.isLocked 
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={control.isLocked ? "Unlock Setting" : "Lock Setting"}
          >
            {control.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button 
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Reset to Default"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Settings size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">General Session Controls</h3>
          </div>
          <GovernanceRow 
            label="Academic Session" 
            control={config.session.academicSession} 
            onToggle={() => handleToggleLock('session.academicSession')}
            onChange={(val) => handleValueChange('session.academicSession', val)}
            description="Global session identifier for all admissions"
          />
          <GovernanceRow 
            label="Admission Intake Status" 
            control={config.session.admissionStatus} 
            onToggle={() => handleToggleLock('session.admissionStatus')}
            onChange={(val) => handleValueChange('session.admissionStatus', val)}
            description="Toggle availability of admission portal school-wide"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Layers size={18} className="text-emerald-600" />
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">Admission Modes</h3>
          </div>
          {config.modes.map(mode => (
            <div key={mode.id} className="p-4 bg-white dark:bg-[#151e32] border border-gray-100 dark:border-gray-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{mode.name}</span>
                <div className="flex gap-2">
                  {getSourceBadge(mode.enabled.source)}
                  <button onClick={() => handleToggleLock(`modes.${mode.id}.enabled`)} className="text-gray-400">
                    {mode.enabled.isLocked ? <Lock size={12} className="text-red-500" /> : <Unlock size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Screening Required</span>
                <button className={`w-8 h-4 rounded-full transition-colors ${mode.requireScreening.value ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-2 h-2 bg-white rounded-full transition-transform ${mode.requireScreening.value ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormBuilder = () => (
    <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application Form Governance</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control visibility and requirement rules for existing School Admin form fields.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase text-[10px] font-black tracking-widest">
              <th className="px-6 py-4">Field Label</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-center">Required</th>
              <th className="px-6 py-4 text-center">Hidden</th>
              <th className="px-6 py-4 text-center">Lock Status</th>
              <th className="px-6 py-4 text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {config.formFields.map(field => (
              <tr key={field.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-bold text-gray-900 dark:text-white">{field.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono text-gray-500 uppercase">{field.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button 
                      disabled={field.required.isLocked}
                      className={`p-1.5 rounded-lg ${field.required.value ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-300'} ${field.required.isLocked ? 'opacity-50' : ''}`}
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button 
                      disabled={field.hidden.isLocked}
                      className={`p-1.5 rounded-lg ${field.hidden.value ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-300'} ${field.hidden.isLocked ? 'opacity-50' : ''}`}
                    >
                      {field.hidden.value ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button className={`p-1.5 rounded-lg ${field.locked ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-300'}`}>
                      {field.locked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {getSourceBadge(field.required.source as ConfigSource)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkflow = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admission Workflow Designer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure the multi-level approval process for applicants.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <Plus size={16} /> Add Level
          </button>
        </div>

        <div className="space-y-4 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
          {config.workflow.map((step, index) => (
            <div key={step.id} className="relative flex items-center gap-6 group">
              <div className={`z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 bg-white dark:bg-[#151e32] ${step.isLocked ? 'border-red-200 dark:border-red-900/30' : 'border-gray-100 dark:border-gray-800'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Step</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">{index + 1}</span>
              </div>
              
              <div className={`flex-1 p-5 rounded-2xl border transition-all flex items-center justify-between ${step.isLocked ? 'bg-red-50/30 dark:bg-red-900/5 border-red-100 dark:border-red-900/20' : 'bg-white dark:bg-[#151e32] border-gray-100 dark:border-gray-800 group-hover:shadow-lg'}`}>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {step.name}
                    {step.isLocked && <Lock size={12} className="text-red-500" />}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">{step.role}</span>
                    <span className="text-xs text-gray-400">Action: {index === 0 ? 'Trigger' : index === config.workflow.length - 1 ? 'Auto' : 'Approval'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                    <Settings size={18} />
                  </button>
                  {!step.isLocked && (
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <Shield size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <Shield size={14} /> Governance Layer
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Admissions Master Control</h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl">
              Centralized governance for institution admissions. Override local school settings, lock critical compliance rules, and manage global application workflows.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Governance Plan</p>
              <p className="text-white font-bold">Enterprise Compliance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Lock size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-900/50 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview & General', icon: GitMerge },
          { id: 'form', label: 'Form Builder Control', icon: FileText },
          { id: 'workflow', label: 'Workflow Governance', icon: GitMerge },
          { id: 'policies', label: 'Global Policies', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-white dark:bg-[#151e32] text-blue-600 dark:text-blue-400 shadow-xl ring-1 ring-black/5 dark:ring-white/10 scale-105' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }
            `}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'form' && renderFormBuilder()}
        {activeTab === 'workflow' && renderWorkflow()}
        {activeTab === 'policies' && (
          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Shield size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Compliance Policies</h3>
            <p className="text-gray-500 max-w-md mx-auto">Set mandatory cut-off limits, age requirements, and prerequisite validation rules that apply across all institution branches.</p>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <GovernanceRow 
                label="Force Minimum Score" 
                control={config.policies.allowBelowCutoff} 
                onToggle={() => {}}
                onChange={() => {}}
                description="If enabled, no applicant below cutoff can be admitted even by VC."
              />
              <GovernanceRow 
                label="Enforce Rolling Admission" 
                control={config.policies.rollingAdmission} 
                onToggle={() => {}}
                onChange={() => {}}
                description="Force schools to process applications in batches."
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 rounded-3xl">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Info size={18} />
          <p className="text-sm font-medium">Changes made here will immediately override School Admin configurations across the system.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Discard Changes
          </button>
          <button className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Deploy Governance Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsGovernance;

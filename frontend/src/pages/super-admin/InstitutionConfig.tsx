import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  GraduationCap, 
  UserPlus, 
  FileSignature, 
  BarChart3, 
  Layout, 
  User, 
  Settings, 
  Users, 
  School,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
  Globe,
  Sliders,
  Construction,
  Power
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  critical: boolean; 
  locked: boolean;   
}

interface AuditLog {
  id: string;
  moduleTitle: string;
  action: 'enabled' | 'disabled';
  timestamp: string;
  user: string;
}

const GlobalModules: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; moduleId: string | null }>({ isOpen: false, moduleId: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate fetching global data
    const timer = setTimeout(() => {
      setModules([
        {
          id: 'academics',
          title: 'Academics',
          description: 'Course management, grading systems, and curriculum planning.',
          icon: GraduationCap,
          color: 'bg-blue-600',
          active: true,
          critical: true,
          locked: false
        },
        {
          id: 'admissions',
          title: 'Admissions',
          description: 'Applicant tracking, enrollment workflows, and entrance exams.',
          icon: UserPlus,
          color: 'bg-emerald-600',
          active: true,
          critical: false,
          locked: false
        },
        {
          id: 'examinations',
          title: 'Examinations',
          description: 'Exam scheduling, hall management, and result processing.',
          icon: FileSignature,
          color: 'bg-purple-600',
          active: true,
          critical: true,
          locked: false
        },
        {
          id: 'reports',
          title: 'Reports & Analytics',
          description: 'Comprehensive reporting dashboard and data visualization.',
          icon: BarChart3,
          color: 'bg-orange-600',
          active: true,
          critical: false,
          locked: false
        },
        {
          id: 'staff_portal',
          title: 'Staff Portal',
          description: 'Self-service portal for faculty and administrative staff.',
          icon: Layout,
          color: 'bg-teal-600',
          active: true,
          critical: false,
          locked: false
        },
        {
          id: 'student_portal',
          title: 'Student Portal',
          description: 'Access to grades, courses, and fees for students.',
          icon: User,
          color: 'bg-indigo-600',
          active: true,
          critical: false,
          locked: false
        },
        {
          id: 'settings',
          title: 'Settings',
          description: 'Global system configuration and preferences.',
          icon: Settings,
          color: 'bg-gray-600',
          active: true,
          critical: true,
          locked: true
        },
        {
          id: 'staff',
          title: 'Staff Management',
          description: 'HR records, payroll, and leave management.',
          icon: Users,
          color: 'bg-pink-600',
          active: true,
          critical: true,
          locked: false
        },
        {
          id: 'student',
          title: 'Student Management',
          description: 'Student profiles, discipline records, and alumni tracking.',
          icon: School,
          color: 'bg-cyan-600',
          active: true,
          critical: true,
          locked: false
        }
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleRequest = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (!module || module.locked) return;

    if (module.active && module.critical) {
      setConfirmDialog({ isOpen: true, moduleId: id });
    } else {
      toggleModule(id);
    }
  };

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === id) {
        const newState = !m.active;
        // Add audit log
        const newLog: AuditLog = {
          id: Date.now().toString(),
          moduleTitle: m.title,
          action: newState ? 'enabled' : 'disabled',
          timestamp: new Date().toLocaleTimeString(),
          user: 'System Admin'
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs].slice(0, 10)); // Keep last 10
        return { ...m, active: newState };
      }
      return m;
    }));
    setConfirmDialog({ isOpen: false, moduleId: null });
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-none pb-10 relative">
      
      {/* Confirmation Modal Overlay */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-500">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Disable Global Module?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              You are about to disable <span className="font-bold text-gray-900 dark:text-white">{modules.find(m => m.id === confirmDialog.moduleId)?.title}</span> for <span className="font-bold text-red-600 dark:text-red-400">ALL INSTITUTIONS</span>. 
              This will immediately revoke access for every school in the system.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, moduleId: null })}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDialog.moduleId && toggleModule(confirmDialog.moduleId)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all"
              >
                Yes, Disable Globally
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="xl:col-span-8 space-y-6">
           <div className="flex items-center justify-between">
             <Skeleton className="h-8 w-64" />
             <Skeleton className="h-10 w-48 rounded-xl" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[...Array(6)].map((_, i) => (
               <Skeleton key={i} className="h-48 rounded-xl" />
             ))}
           </div>
        </div>
      ) : (
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                System-Wide Control
                <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <Globe size={10} /> Global
                </span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage module availability across the entire platform.</p>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search modules..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((module) => (
              <div 
                key={module.id} 
                className={`
                  relative overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col h-full group
                  ${module.active 
                    ? 'bg-white dark:bg-[#151e32] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1' 
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-80 hover:opacity-100'
                  }
                `}
              >
                {/* Status Stripe */}
                <div className={`h-1.5 w-full ${module.active ? module.color : 'bg-gray-300 dark:bg-gray-700'}`} />

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`
                      p-3 rounded-xl transition-colors
                      ${module.active 
                        ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }
                    `}>
                      <module.icon size={24} />
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggleRequest(module.id)}
                      disabled={module.locked}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${module.locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        ${module.active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}
                      `}
                    >
                      <span className="sr-only">Enable {module.title}</span>
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                          ${module.active ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>

                  <div className="mb-4">
                    <h3 className={`font-bold text-lg mb-1 ${module.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {module.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {module.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {module.active ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-500">Disabled</span>
                        </>
                      )}
                    </div>
                    {module.locked && (
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                        <Lock size={10} />
                        <span>Essential</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Column: Audit Log & Summary */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Audit Log Card */}
        <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-blue-500" />
              Global Activity
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">
              System
            </span>
          </div>
          <div className="p-0 max-h-[400px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No recent global changes.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${log.action === 'enabled' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-xs text-gray-900 dark:text-white">
                          <span className="font-bold">{log.moduleTitle}</span> was {log.action} globally.
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          {log.timestamp} • by {log.user}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Stats or Info */}
        <div className="bg-blue-600 rounded-xl border border-blue-500 overflow-hidden shadow-lg text-white p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="font-bold text-lg mb-2 relative z-10">Global Impact</h3>
          <p className="text-blue-100 text-sm mb-4 relative z-10">
            Disabling modules here affects all 156 registered institutions immediately.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-lg relative z-10">
            <Globe size={14} />
            System Wide
          </div>
        </div>
      </div>
    </div>
  );
};

const MaintenanceMode: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('We are currently undergoing scheduled maintenance. Please check back later.');
  const [allowSuperAdmin, setAllowSuperAdmin] = useState(true);

  return (
    <div className="max-w-4xl">
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className={`p-4 rounded-2xl ${enabled ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'} transition-colors duration-300`}>
            <Construction size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Maintenance Mode</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              When enabled, all users (except those allowed) will see a maintenance screen instead of the application. 
              Use this during scheduled updates or critical fixes.
            </p>
          </div>
          
          <button
            onClick={() => setEnabled(!enabled)}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20
              ${enabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-700'}
            `}
          >
            <span className="sr-only">Enable Maintenance Mode</span>
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md
                ${enabled ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Configuration */}
        <div className={`space-y-6 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          
          {/* Message Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Maintenance Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter the message users will see..."
            />
          </div>

          {/* Settings */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Super Admin Bypass</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allow Super Admins to access the system while in maintenance mode.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={allowSuperAdmin}
                  onChange={() => setAllowSuperAdmin(!allowSuperAdmin)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${enabled ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Status: <span className={enabled ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-900 dark:text-white font-bold'}>
                {enabled ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
          {enabled && (
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all">
              Update Settings
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

const InstitutionConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('modules');

  const tabs = [
    { id: 'modules', label: 'Global Modules', icon: Layout },
    { id: 'maintenance', label: 'Maintenance Mode', icon: Construction },
    { id: 'general', label: 'General Settings', icon: Sliders },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Institution Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global settings and default configurations for all institutions.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl w-fit border border-gray-200 dark:border-gray-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
              ${activeTab === tab.id 
                ? 'bg-white dark:bg-[#151e32] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'modules' && <GlobalModules />}
        {activeTab === 'maintenance' && <MaintenanceMode />}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Sliders size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">General Settings</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Global configuration options for default timezones, currency, and language settings will be available here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionConfig;

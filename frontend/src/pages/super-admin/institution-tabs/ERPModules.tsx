import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
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
  MoreVertical,
  CreditCard,
  Mail,
  Phone
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  critical: boolean; // Requires confirmation to disable
  locked: boolean;   // Cannot be disabled (e.g., Settings)
}

interface AuditLog {
  id: string;
  moduleTitle: string;
  action: 'enabled' | 'disabled';
  timestamp: string;
  user: string;
}

const ERPModules: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; moduleId: string | null }>({ isOpen: false, moduleId: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate fetching data
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
          user: 'Super Admin'
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
            <div className="flex items-center gap-4 mb-4 text-amber-500">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Disable Critical Module?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              You are about to disable <span className="font-bold text-gray-900 dark:text-white">{modules.find(m => m.id === confirmDialog.moduleId)?.title}</span>. 
              This will immediately revoke access for all school admins and may disrupt ongoing operations.
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
                Yes, Disable Module
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
                Module Control
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                  Super Admin
                </span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage global module availability for this institution.</p>
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
              Recent Activity
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <div className="p-0 max-h-[300px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No recent changes recorded.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${log.action === 'enabled' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-xs text-gray-900 dark:text-white">
                          <span className="font-bold">{log.moduleTitle}</span> was {log.action}.
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

        {/* Subscription Summary (Preserved) */}
        <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Subscription</h3>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="p-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 mb-5 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Current Plan</span>
                <div className="bg-blue-500 rounded-full p-0.5">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">Enterprise Yearly</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Renews on <span className="text-gray-900 dark:text-white font-bold">Oct 12, 2024</span></p>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <CreditCard size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Payment Method</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Mastercard •••• 4242</div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              Manage Billing
            </button>
          </div>
        </div>

        {/* Primary Contact (Preserved) */}
        <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">Primary Contact</h3>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                SJ
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-base">Sarah Jenkins</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Admin Administrator</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <a href="mailto:s.jenkins@gha.edu" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">s.jenkins@gha.edu</span>
              </a>
              <a href="tel:+15550123456" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">+1 (555) 012-3456</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPModules;

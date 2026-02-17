import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  GraduationCap, 
  Wallet, 
  BookOpen,
  CheckCircle2,
  UserPlus,
  FileText,
  CreditCard,
  Settings,
  Users,
  Bus,
  Library,
  LayoutGrid,
  History,
  Calendar,
  Briefcase,
  Eye,
  X,
  Activity,
  Database,
  BarChart3,
  FileSignature,
  Layout,
  User,
  School
} from 'lucide-react';

interface ModuleStat {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  stats: ModuleStat[];
  lastSync: string;
}

const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const recentActivity = [
    {
      id: 1,
      title: 'System Maintenance Completed',
      description: 'Scheduled maintenance for the LMS module was completed successfully.',
      time: '2 hours ago',
      type: 'success',
      icon: CheckCircle2
    },
    {
      id: 2,
      title: 'New Admin Added',
      description: 'Sarah Jenkins created a new admin account for David Miller.',
      time: '5 hours ago',
      type: 'info',
      icon: UserPlus
    },
    {
      id: 3,
      title: 'Term 1 Reports Generated',
      description: 'Bulk report card generation initiated for 1,200 students.',
      time: '1 day ago',
      type: 'warning',
      icon: FileText
    },
    {
      id: 4,
      title: 'Subscription Auto-Renewed',
      description: 'Monthly ERP subscription payment processed successfully.',
      time: '2 days ago',
      type: 'success',
      icon: CreditCard
    },
    {
      id: 5,
      title: 'Module Configured',
      description: 'Transport module initial setup started by admin.',
      time: '3 days ago',
      type: 'info',
      icon: Settings
    }
  ];

  const modules: ModuleData[] = [
    {
      id: 'academics',
      title: 'Academics',
      description: 'Course management, grading systems, and curriculum planning.',
      icon: GraduationCap,
      color: 'bg-blue-600',
      active: true,
      lastSync: '10 mins ago',
      stats: [
        { label: 'Active Sessions', value: '2', trend: 'Current' },
        { label: 'Departments', value: '12' },
        { label: 'Total Courses', value: '145', trend: '+5%', trendUp: true }
      ]
    },
    {
      id: 'admissions',
      title: 'Admissions',
      description: 'Applicant tracking, enrollment workflows, and entrance exams.',
      icon: UserPlus,
      color: 'bg-emerald-600',
      active: true,
      lastSync: '5 mins ago',
      stats: [
        { label: 'Applications', value: '1,240', trend: '+15%', trendUp: true },
        { label: 'Pending Review', value: '45' },
        { label: 'Admitted', value: '850', trend: '68%' }
      ]
    },
    {
      id: 'examinations',
      title: 'Examinations',
      description: 'Exam scheduling, hall management, and result processing.',
      icon: FileSignature,
      color: 'bg-purple-600',
      active: true,
      lastSync: '1 hour ago',
      stats: [
        { label: 'Scheduled Exams', value: '24' },
        { label: 'Results Published', value: '98%', trend: '+2%', trendUp: true },
        { label: 'Pending Approval', value: '5' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Comprehensive reporting dashboard and data visualization.',
      icon: BarChart3,
      color: 'bg-orange-600',
      active: true,
      lastSync: 'Just now',
      stats: [
        { label: 'Daily Reports', value: '15' },
        { label: 'Generated', value: '1,205' },
        { label: 'Downloads', value: '450' }
      ]
    },
    {
      id: 'staff_portal',
      title: 'Staff Portal',
      description: 'Self-service portal for faculty and administrative staff.',
      icon: Layout,
      color: 'bg-teal-600',
      active: true,
      lastSync: '2 mins ago',
      stats: [
        { label: 'Active Users', value: '210', trend: '85%' },
        { label: 'Logins Today', value: '185' },
        { label: 'Requests', value: '12' }
      ]
    },
    {
      id: 'student_portal',
      title: 'Student Portal',
      description: 'Access to grades, courses, and fees for students.',
      icon: User,
      color: 'bg-indigo-600',
      active: true,
      lastSync: '1 min ago',
      stats: [
        { label: 'Active Users', value: '3,200', trend: '92%' },
        { label: 'Logins Today', value: '2,850' },
        { label: 'Course Reg.', value: 'Complete' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Global system configuration and preferences.',
      icon: Settings,
      color: 'bg-gray-600',
      active: true,
      lastSync: '3 days ago',
      stats: [
        { label: 'Configs Changed', value: '5' },
        { label: 'System Version', value: 'v2.4.0' },
        { label: 'Backups', value: 'Daily' }
      ]
    },
    {
      id: 'staff',
      title: 'Staff Management',
      description: 'HR records, payroll, and leave management.',
      icon: Users,
      color: 'bg-pink-600',
      active: true,
      lastSync: '4 hours ago',
      stats: [
        { label: 'Total Staff', value: '245' },
        { label: 'On Leave', value: '8' },
        { label: 'New Hires', value: '3', trend: 'This Month' }
      ]
    },
    {
      id: 'student',
      title: 'Student Management',
      description: 'Student profiles, discipline records, and alumni tracking.',
      icon: School,
      color: 'bg-cyan-600',
      active: true,
      lastSync: '10 mins ago',
      stats: [
        { label: 'Total Students', value: '3,842', trend: '+12%', trendUp: true },
        { label: 'Active', value: '3,810' },
        { label: 'Alumni', value: '1,250' }
      ]
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-none pb-10">
      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#151e32] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-32">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Skeleton className="h-8 w-8 rounded-lg" />
                   <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm h-40 flex flex-col">
                     <div className="flex justify-between items-start mb-3">
                       <Skeleton className="h-10 w-10 rounded-xl" />
                       <Skeleton className="h-5 w-9 rounded-full" />
                     </div>
                     <Skeleton className="h-5 w-32 mb-2" />
                     <Skeleton className="h-3 w-full mb-1" />
                     <Skeleton className="h-3 w-2/3 mb-4" />
                     <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                       <Skeleton className="h-2 w-2 rounded-full" />
                       <Skeleton className="h-3 w-16" />
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm h-[500px]">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                   <Skeleton className="h-8 w-8 rounded-lg" />
                   <Skeleton className="h-5 w-32" />
                 </div>
                 <div className="p-4 space-y-6">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex gap-4">
                       <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                       <div className="space-y-2 w-full">
                         <Skeleton className="h-3 w-16" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-3 w-3/4" />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="Total Students"
          value="3,842"
          subtext="+12% vs last year"
          subtextTrend="up"
          icon={GraduationCap}
          color="blue"
          progress={85}
        />
        <StatusCard 
          title="Total Teachers"
          value="245"
          subtext="98% Attendance"
          subtextTrend="up"
          icon={Briefcase}
          color="emerald"
          progress={92}
        />
        <StatusCard 
          title="Total Staff"
          value="112"
          subtext="Admin & Support"
          subtextTrend="up"
          icon={Users}
          color="orange"
          progress={78}
        />
        <StatusCard 
          title="Current Semester"
          value="Term 2"
          subtext="Ends Jun 30, 2024"
          icon={Calendar}
          color="purple"
          progress={60}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Provisioned Modules */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <LayoutGrid size={18} />
              </span>
              Provisioned ERP Modules
            </h2>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              Manage Licenses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${module.active ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                    <module.icon size={22} className={module.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'} />
                  </div>
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${module.active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${module.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 text-base">{module.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex-grow leading-relaxed">{module.description}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${module.active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                    <span className={`text-xs font-bold ${module.active ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500'}`}>
                      {module.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {module.active && (
                    <button 
                      onClick={() => setSelectedModule(module)}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <History size={16} />
                </span>
                Recent Activity
              </h2>
            </div>

            <div className="p-4">
              <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="relative pl-10">
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-[#151e32] z-10 ${
                      activity.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      activity.type === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">{activity.time}</span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{activity.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      {/* Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
            <div className={`p-6 ${selectedModule.color} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 blur-2xl"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl inline-flex text-white mb-4">
                  <selectedModule.icon size={28} />
                </div>
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white relative z-10">{selectedModule.title}</h2>
              <p className="text-blue-100 relative z-10 text-sm mt-1">{selectedModule.description}</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Activity size={16} />
                  <span>Last synced: <span className="font-medium text-gray-900 dark:text-white">{selectedModule.lastSync}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">Live System</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {selectedModule.stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                    {stat.trend && (
                      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                        stat.trendUp 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        <BarChart3 size={14} />
                        {stat.trend}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                  View Logs
                </button>
                <button className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-500/20">
                  Configure Module
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusCard: React.FC<{
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'orange' | 'purple';
  subtextTrend?: 'up' | 'down';
  progress?: number;
}> = ({ title, value, subtext, icon: Icon, color, subtextTrend, progress }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
          <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</div>
        </div>
        <div className={`p-2.5 rounded-xl ${colorStyles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-3">
          {subtextTrend === 'up' && <span className="text-emerald-500 font-bold text-xs">▲</span>}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{subtext}</span>
        </div>
        {progress && (
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                color === 'blue' ? 'bg-blue-600' : 
                color === 'emerald' ? 'bg-emerald-500' : 
                color === 'orange' ? 'bg-orange-500' : 
                'bg-purple-500'
              }`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;

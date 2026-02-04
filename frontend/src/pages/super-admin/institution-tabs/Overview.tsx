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
  Briefcase
} from 'lucide-react';

const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);

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

  const modules = [
    {
      id: 'student-info',
      title: 'Student Info System',
      description: 'Core records and profiles',
      icon: GraduationCap,
      color: 'bg-blue-600',
      active: true
    },
    {
      id: 'finance',
      title: 'Finance & Billing',
      description: 'Invoicing and payments',
      icon: Wallet,
      color: 'bg-emerald-600',
      active: true
    },
    {
      id: 'lms',
      title: 'LMS & E-Learning',
      description: 'Courses and quizzes',
      icon: BookOpen,
      color: 'bg-purple-600',
      active: true
    },
    {
      id: 'hr',
      title: 'HR & Payroll',
      description: 'Staff management',
      icon: Users,
      color: 'bg-orange-600',
      active: true
    },
    {
      id: 'transport',
      title: 'Transport',
      description: 'Fleet and routes',
      icon: Bus,
      color: 'bg-indigo-600',
      active: false
    },
    {
      id: 'library',
      title: 'Library',
      description: 'Book inventory',
      icon: Library,
      color: 'bg-pink-600',
      active: false
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
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <span className={`w-2 h-2 rounded-full ${module.active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  <span className={`text-xs font-bold ${module.active ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500'}`}>
                    {module.active ? 'Active' : 'Inactive'}
                  </span>
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
    </div>
  );
};

const StatusCard: React.FC<{
  title: string;
  value: string;
  subtext: string;
  icon: any;
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

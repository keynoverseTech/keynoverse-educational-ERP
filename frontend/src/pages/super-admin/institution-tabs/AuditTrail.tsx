import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  User, 
  Filter,
  Download,
  Calendar,
  Code,
  Database
} from 'lucide-react';

const AuditTrail: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const logs = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      time: '10:42:15 AM',
      user: { name: 'Sarah Jenkins', role: 'Admin', avatar: 'SJ', color: 'bg-indigo-600' },
      action: 'Module Enabled',
      actionType: 'success',
      ip: '192.168.1.42',
      details: 'Activated "Learning Management (LMS)" module.',
      raw: true
    },
    {
      id: 2,
      date: 'Oct 24, 2023',
      time: '09:15:30 AM',
      user: { name: 'System Automator', role: 'System', avatar: 'sys', color: 'bg-gray-600' },
      action: 'Data Backup',
      actionType: 'info',
      ip: '10.0.0.5',
      details: 'Daily database backup completed successfully.',
      raw: true
    },
    {
      id: 3,
      date: 'Oct 23, 2023',
      time: '04:45:12 PM',
      user: { name: 'Alex Morgan', role: 'Super Admin', avatar: 'AM', color: 'bg-purple-600' },
      action: 'Settings Changed',
      actionType: 'warning',
      ip: '172.16.254.1',
      details: 'Updated organization notification preferences.',
      raw: true
    },
    {
      id: 4,
      date: 'Oct 23, 2023',
      time: '02:20:05 PM',
      user: { name: 'Unknown User', role: 'Guest', avatar: '??', color: 'bg-red-600' },
      action: 'Login Failed',
      actionType: 'error',
      ip: '198.51.100.23',
      details: 'Multiple failed login attempts from unrecognized device.',
      raw: true
    },
    {
      id: 5,
      date: 'Oct 22, 2023',
      time: '11:05:40 AM',
      user: { name: 'Sarah Jenkins', role: 'Admin', avatar: 'SJ', color: 'bg-indigo-600' },
      action: 'Subscription',
      actionType: 'success',
      ip: '192.168.1.42',
      details: 'Updated billing credit card information ending in 4242.',
      raw: true
    }
  ];

  const getActionStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />;
      case 'info': return <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />;
      case 'warning': return <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />;
      case 'error': return <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />;
      default: return <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2" />;
    }
  };

  return (
    <div className="space-y-3 text-sm w-full max-w-none">
      {loading ? (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Filters Bar Skeleton */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-3 justify-between items-end md:items-center">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex flex-col gap-1.5 w-full md:w-auto">
                   <Skeleton className="h-3 w-16" />
                   <Skeleton className="h-10 w-full md:w-48 rounded-xl" />
                 </div>
               ))}
            </div>
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a2438] border-b border-gray-200 dark:border-gray-800">
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="px-3 py-2"><Skeleton className="h-3 w-20" /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2"><div className="space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></td>
                    <td className="px-3 py-2"><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></td>
                    <td className="px-3 py-2"><Skeleton className="h-6 w-32 rounded-full" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-24 rounded" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-3 py-2 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Skeleton */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1a2438]/50">
             <Skeleton className="h-4 w-48" />
             <div className="flex gap-2">
               <Skeleton className="h-8 w-20 rounded-lg" />
               <Skeleton className="h-8 w-20 rounded-lg" />
             </div>
          </div>
        </div>
      ) : (
      <>
      {/* Logs Table with Integrated Filters */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Filters Bar */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-3 justify-between items-end md:items-center">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Date Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Date Range</label>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors w-full md:w-64 justify-between">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Oct 01, 2023 - Oct 24, 2023</span>
                </div>
              </button>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Category</label>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors w-full md:w-48 justify-between">
                <span>All Categories</span>
                <Filter size={14} className="text-gray-500" />
              </button>
            </div>

            {/* User Search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">User</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Filter by user" 
                  className="w-full md:w-48 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
            <Download size={16} />
            <span>Export Logs</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a2438] border-b border-gray-200 dark:border-gray-800">
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Time</th>
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                <th className="px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Raw</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{log.date}</div>
                    <div className="text-xs text-gray-500">{log.time}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {log.user.avatar === 'sys' ? (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <Database size={14} className="text-gray-300" />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${log.user.color} flex items-center justify-center text-xs font-bold text-white`}>
                          {log.user.avatar}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{log.user.name}</div>
                        <div className="text-xs text-gray-500">{log.user.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getActionStyles(log.actionType)}`}>
                      {getActionIcon(log.actionType)}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <code className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {log.ip}
                    </code>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-700 rounded-lg">
                      <Code size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1a2438]/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">Showing <span className="font-bold text-gray-900 dark:text-white">1-5</span> of <span className="font-bold text-gray-900 dark:text-white">1,248</span> logs</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              Previous
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              Next
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AuditTrail;

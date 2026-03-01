import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  ChevronRight, 
  Building2, 
  MapPin, 
  Calendar, 
  LayoutDashboard,
  Layers,
  Users,
  CreditCard,
  FileText,
  Ban,
  Edit,
  BookOpen,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tabs
import Overview from './institution-tabs/Overview';
import ERPModules from './institution-tabs/ERPModules';
import AuditTrail from './institution-tabs/AuditTrail';
import UsersTab from './institution-tabs/Users';
import Subscriptions from './institution-tabs/Subscriptions';
import AcademicCatalog from './institution-tabs/AcademicCatalog';

const InstitutionDetails: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Shorter load time for shell
    return () => clearTimeout(timer);
  }, []);

  // Mock Institution Data
  const institution = {
    id: 'INST-2023-001',
    name: 'Global Heights Academy',
    logo: 'GH',
    logoColor: 'bg-indigo-600',
    type: 'K-12 Education',
    status: 'Active',
    joinedDate: 'Oct 12, 2023',
    email: 'admin@gha.edu',
    phone: '+1 (555) 012-3456',
    address: '123 Education Lane, New York, NY',
    subscription: 'Enterprise Plan'
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'modules', label: 'ERP Modules', icon: Layers },
    { id: 'academic', label: 'Program Governance', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'modules':
        return <ERPModules />;
      case 'academic':
        return <AcademicCatalog />;
      case 'users':
        return <UsersTab />;
      case 'subscription':
        return <Subscriptions />;
      case 'audit':
        return <AuditTrail />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header / Breadcrumbs */}
      <div className="bg-white dark:bg-[#151e32] -mx-4 -mt-4 p-6 border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {loading ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Skeleton className="h-7 w-32 rounded-md" />
                      <Skeleton className="h-7 w-32 rounded-md" />
                      <Skeleton className="h-7 w-40 rounded-md" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>

              {/* Navigation Tabs Skeleton */}
              <div className="flex items-center gap-2 pt-4">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors" onClick={() => navigate('/super-admin/dashboard')}>Admin</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                <span className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors" onClick={() => navigate('/super-admin/institutions')}>Institutions</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{institution.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-20 h-20 rounded-2xl ${institution.logoColor} flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-[#151e32]`}>
                    {institution.logo}
                  </div>
                  <div className="pt-1">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                      {institution.name}
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {institution.status}
                      </span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <Building2 size={14} className="text-gray-400" />
                        {institution.id}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        New York, USA
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        Joined {institution.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors shadow-sm"
                  >
                    <Key size={16} />
                    <span>Credentials</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <Ban size={16} />
                    <span>Suspend</span>
                  </button>
                </div>
              </div>

              {/* Credentials Panel */}
              {showCredentials && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Portal Login Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Admin Email</label>
                      <div className="font-mono text-sm text-gray-900 dark:text-white select-all bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        {institution.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Initial Password</label>
                      <div className="font-mono text-sm text-gray-900 dark:text-white select-all bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        Password123!
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Login URL</label>
                      <div className="font-mono text-sm text-blue-600 dark:text-blue-400 select-all bg-blue-50/50 dark:bg-blue-900/10 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-900/20 truncate">
                        https://gha.portal.edu.ng
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl w-fit mt-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                        ${isActive 
                          ? 'bg-white dark:bg-[#151e32] text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                        }
                      `}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[1600px] mx-auto min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default InstitutionDetails;

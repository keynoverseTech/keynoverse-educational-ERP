import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
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
  BookOpen,
  Key,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import superAdminService from '../../services/superAdminApi';
import { sanitizeUrl, isHttpUrl } from '../../utils/sanitizeUrl';
import LogoAvatar from '../../components/ui/LogoAvatar';

// Tabs
import Overview from './institution-tabs/Overview';
import ERPModules from './institution-tabs/ERPModules';
import AuditTrail from './institution-tabs/AuditTrail';
import UsersTab from './institution-tabs/Users';
import Subscriptions from './institution-tabs/Subscriptions';
import AcademicCatalog from './institution-tabs/AcademicCatalog';

const InstitutionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get institution ID from URL
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);
  const [institution, setInstitution] = useState<any>(null); // State for fetched data
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'danger' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: async () => {},
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch real institution details by fetching list and filtering (until dedicated endpoint is available)
        const response = await superAdminService.getInstitutions();
        const institutions = Array.isArray(response) ? response : (response as any).data || [];
        const found = institutions.find((inst: any) => inst.id === id);
        
        if (found) {
          const cleanedLogo = sanitizeUrl(found.logo);
          const resolvedLogo = isHttpUrl(cleanedLogo)
            ? cleanedLogo
            : (found.name ? found.name.substring(0, 2).toUpperCase() : 'GH');
          // Map API data to UI structure
          setInstitution({
            id: found.id,
            name: found.name,
            logo: resolvedLogo,
            logoColor: 'bg-indigo-600', // Randomize or map if available
            type: found.institution_type_id ? 'Polytechnic' : 'Institution', // Map type ID to name if possible
            status: (found.status || 'pending').toString().toLowerCase(),
            joinedDate: new Date(found.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            email: found.contact_email,
            phone: found.rector_phone_number || 'N/A',
            address: found.address || 'N/A',
            subscription: 'Enterprise Plan' // Placeholder until subscription data is linked
          });
        } else {
           // If not found in list (e.g. pagination), fallback to mock or error
           console.error('Institution not found in list');
        }
      } catch (err) {
        console.error('Failed to fetch institution details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Fallback if fetch fails or while loading (initial render handled by loading state)
  const displayInstitution = institution || {
    id: id || 'INST-2023-001',
    name: 'Loading...',
    logo: 'GH',
    logoColor: 'bg-indigo-600',
    type: 'K-12 Education',
    status: 'pending',
    joinedDate: 'Oct 12, 2023',
    email: 'admin@gha.edu',
    phone: '+1 (555) 012-3456',
    address: '123 Education Lane, New York, NY',
    subscription: 'Enterprise Plan'
  };
  const statusNormalized = (displayInstitution.status || '').toString().toLowerCase();
  const statusLabel = statusNormalized ? `${statusNormalized.charAt(0).toUpperCase()}${statusNormalized.slice(1)}` : '';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'modules', label: 'ERP Modules', icon: Layers },
    { id: 'academic', label: 'Approved Programmes', icon: BookOpen },
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
        return <AcademicCatalog institutionId={id} />;
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

  const refreshInstitutionStatus = async (institutionId: string) => {
    const attempts = 6;
    for (let i = 0; i < attempts; i++) {
      try {
        const refreshed = await superAdminService.getInstitution(institutionId);
        const refreshedStatus = (refreshed?.status || '').toString().toLowerCase();
        if (refreshedStatus) {
          setInstitution((prev: any) => ({ ...(prev || {}), status: refreshedStatus }));
        }
        if (refreshedStatus && refreshedStatus !== 'suspended') return refreshedStatus;
      } catch {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, 700));
    }
    return (institution?.status || '').toString().toLowerCase();
  };

  const handleSubmit = () => {
    if (!id) return;
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: 'Submit Application',
      message: 'Are you sure you want to submit this application for review? It will be moved to pending status.',
      confirmText: 'Submit',
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          await superAdminService.updateInstitution(id, { status: 'pending' });
          setInstitution((prev: any) => ({ ...prev, status: 'pending' }));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to submit application', error);
          alert('Failed to submit application');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const handleSuspend = () => {
    if (!id) return;
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Suspend Institution',
      message: 'Are you sure you want to suspend this institution? This will restrict access for all users under this institution.',
      confirmText: 'Suspend',
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          await superAdminService.suspendInstitution(id);
          // Refresh or update state
          setInstitution((prev: any) => ({ ...prev, status: 'suspended' }));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to suspend institution', error);
          alert('Failed to suspend institution');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const handleReactivate = () => {
    if (!id) return;
    setConfirmModal({
      isOpen: true,
      type: 'success',
      title: 'Reactivate Institution',
      message: 'Are you sure you want to reactivate this institution? Access will be restored.',
      confirmText: 'Reactivate',
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          await superAdminService.reactivateInstitution(id);
          const newStatus = await refreshInstitutionStatus(id);
          if (newStatus === 'suspended') {
            alert('Reactivation was requested, but the institution is still suspended. This usually means the backend did not change the status. Please try again or check the server logs.');
          }
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to reactivate institution', error);
          alert('Failed to reactivate institution');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const handleApprove = () => {
    if (!id) return;
    setConfirmModal({
      isOpen: true,
      type: 'success',
      title: 'Approve Institution',
      message: 'Are you sure you want to approve this institution? This will grant full access to the portal.',
      confirmText: 'Approve',
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          
          if (statusNormalized === 'suspended') {
            await superAdminService.reactivateInstitution(id);
            await refreshInstitutionStatus(id);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            return;
          }

          await superAdminService.approveInstitution(id);
          await refreshInstitutionStatus(id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to approve institution', error);
          alert('Failed to approve institution');
        } finally {
          setIsProcessing(false);
        }
      }
    });
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
                <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{displayInstitution.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <LogoAvatar
                    src={displayInstitution.logo}
                    alt="Logo"
                    fallback={displayInstitution.name ? displayInstitution.name.substring(0, 2).toUpperCase() : 'GH'}
                    className={`w-20 h-20 rounded-2xl ${displayInstitution.logoColor} flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-[#151e32] overflow-hidden`}
                  />
                  <div className="pt-1">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                      {displayInstitution.name}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide flex items-center gap-1.5 ${
                        statusNormalized === 'suspended' 
                          ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                          : statusNormalized === 'draft' || statusNormalized === 'pending' || statusNormalized === 'queried'
                          ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          statusNormalized === 'suspended' ? 'bg-red-500' : 
                          statusNormalized === 'draft' || statusNormalized === 'pending' || statusNormalized === 'queried' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                        }`}></span>
                        {statusLabel}
                      </span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <Building2 size={14} className="text-gray-400" />
                        {displayInstitution.id}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        {displayInstitution.address}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        Joined {displayInstitution.joinedDate}
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
                  {statusNormalized === 'draft' ? (
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Send size={16} />
                      <span>Submit Application</span>
                    </button>
                ) : statusNormalized === 'suspended' ? (
                  <button
                    onClick={handleReactivate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    <span>Reactivate</span>
                  </button>
                ) : statusNormalized === 'pending' || statusNormalized === 'queried' ? (
                  <button
                      onClick={handleApprove}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleSuspend}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Ban size={16} />
                      <span>Suspend</span>
                    </button>
                  )}
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
                        {displayInstitution.email}
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
                        https://{displayInstitution.name.toLowerCase().replace(/\s+/g, '-')}.portal.edu.ng
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

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default InstitutionDetails;

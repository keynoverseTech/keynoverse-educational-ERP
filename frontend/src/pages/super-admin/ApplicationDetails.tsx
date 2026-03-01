import React, { useState, useEffect } from 'react';
import { 
  ChevronRight,
  ArrowLeft, 
  Building, 
  User, 
  Folder, 
  FileText, 
  MessageSquare, 
  History, 
  Eye, 
  Download, 
  Send,
  CheckCircle2,
  Image as ImageIcon,
  X,
  AlertTriangle,
  Info,
  Lock,
  Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';

const ApplicationDetails: React.FC = () => {
  const navigate = useNavigate();
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Action States
  const [appStatus, setAppStatus] = useState<'PENDING APPROVAL' | 'APPROVED' | 'REJECTED' | 'NEEDS CLARIFICATION'>('PENDING APPROVAL');
  const [modalOpen, setModalOpen] = useState<'none' | 'approve' | 'reject' | 'info'>('none');
  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync dark mode state from local storage on mount (since this page is outside DashboardLayout)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' };
      case 'REJECTED':
        return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' };
      case 'NEEDS CLARIFICATION':
        return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' };
      default:
        return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' };
    }
  };

  const handleAction = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (modalOpen === 'approve') setAppStatus('APPROVED');
      if (modalOpen === 'reject') setAppStatus('REJECTED');
      if (modalOpen === 'info') setAppStatus('NEEDS CLARIFICATION');
      
      setIsSubmitting(false);
      setModalOpen('none');
      setActionReason('');
    }, 1000);
  };

  const application = {
    id: 'REG-2024-8842',
    institution: 'Future Leaders Preparatory Academy',
    legalName: 'Future Leaders Preparatory Academy',
    type: 'K-12 Private School',
    website: 'www.flprep.edu.ng',
    regId: 'REG-2024-8842',
    address: '14 Victoria Island Avenue, Lagos, Nigeria, 101241',
    status: 'PENDING APPROVAL',
    statusColor: 'text-amber-500',
    statusBg: 'bg-amber-500/10 border-amber-500/20',
    logo: 'FL',
    logoColor: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400', // Adaptive background for logo box
    contact: {
      name: 'Amara Okafor',
      role: 'Head of Administration',
      email: 'amara.o@flprep.edu.ng',
      phone: '+234 803 123 4567',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200'
    },
    documents: [
      { name: 'Registration_Certificate.pdf', size: '2.4 MB', date: 'Uploaded 2 days ago', type: 'PDF' },
      { name: 'Tax_ID_Document.jpg', size: '1.1 MB', date: 'Uploaded 2 days ago', type: 'IMG' },
      { name: 'Accreditation_Proof.pdf', size: '5.8 MB', date: 'Uploaded 2 days ago', type: 'PDF' }
    ],
    timeline: [
      { id: 1, event: 'Registration viewed by Admin', user: 'Alex Morgan', date: 'Today, 10:42 AM', icon: 'view', active: true },
      { id: 2, event: 'Email Address Verified', user: 'System', date: 'Yesterday, 4:30 PM', icon: 'check', active: true },
      { id: 3, event: 'Phone Number Verified', user: 'System', date: 'Yesterday, 4:28 PM', icon: 'check', active: true },
      { id: 4, event: 'Application Submitted', user: 'Amara Okafor', date: 'Yesterday, 4:15 PM', icon: 'send', active: true }
    ],
    notes: [
      {
        id: 1,
        author: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
        text: 'Documents look authentic. Need to verify if they want the Transport module added later as their website mentions bus services.',
        date: '2h ago'
      }
    ]
  };

  const currentStyles = getStatusStyles(appStatus);

  // Mock Credentials
  const credentials = {
    adminEmail: application.contact.email,
    password: 'Password123!',
    loginUrl: `https://${application.institution.toLowerCase().replace(/\s+/g, '-')}.portal.edu.ng`
  };

  const copyCredentials = () => {
    const text = `Institute: ${application.institution}\nPortal Admin: ${credentials.adminEmail}\nPassword: ${credentials.password}\nLogin URL: ${credentials.loginUrl}`;
    navigator.clipboard.writeText(text);
    alert('Credentials copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-600 dark:text-gray-300 p-6 md:p-8 font-sans relative">
      
      {/* Action Modals */}
      {modalOpen !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700">
            
            {/* Modal Header */}
            <div className="mb-6">
              {modalOpen === 'approve' && (
                <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-500">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Approve Application</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This will grant the institution full access.</p>
                  </div>
                </div>
              )}
              {modalOpen === 'reject' && (
                <div className="flex items-center gap-4 text-red-600 dark:text-red-500">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reject Application</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The institution will be notified of the rejection.</p>
                  </div>
                </div>
              )}
              {modalOpen === 'info' && (
                <div className="flex items-center gap-4 text-blue-600 dark:text-blue-500">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ask the applicant for missing or unclear details.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {modalOpen !== 'approve' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {modalOpen === 'reject' ? 'Reason for Rejection' : 'Message to Applicant'}
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder={modalOpen === 'reject' ? 'e.g. Invalid documents provided...' : 'e.g. Please upload a clearer copy of...'}
                  />
                </div>
              )}
              
              {modalOpen === 'approve' && (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    Are you sure you want to approve <span className="font-bold text-gray-900 dark:text-white">{application.institution}</span>? 
                    An automated email with login credentials will be sent to <span className="font-bold">{application.contact.email}</span>.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Lock size={14} className="text-blue-600 dark:text-blue-400" />
                      Credentials to be Generated
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Portal Admin:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{credentials.adminEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Password:</span>
                        <span className="font-mono font-medium text-gray-900 dark:text-white">{credentials.password}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Login URL:</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 truncate max-w-[200px]">{credentials.loginUrl}</span>
                      </div>
                    </div>
                    <button
                      onClick={copyCredentials}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-[#1e293b] border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Copy size={14} />
                      Copy Credentials
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => {
                  setModalOpen('none');
                  setActionReason('');
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                disabled={isSubmitting || (modalOpen !== 'approve' && !actionReason.trim())}
                className={`
                  px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2
                  ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:scale-105 active:scale-95'}
                  ${modalOpen === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : ''}
                  ${modalOpen === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : ''}
                  ${modalOpen === 'info' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : ''}
                  ${(modalOpen !== 'approve' && !actionReason.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    {modalOpen === 'approve' && 'Confirm Approval'}
                    {modalOpen === 'reject' && 'Reject Application'}
                    {modalOpen === 'info' && 'Send Request'}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {loading ? (
          <>
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                     <Skeleton className="h-10 w-10 rounded-lg" />
                     <div>
                       <div className="flex items-center gap-3">
                         <Skeleton className="h-8 w-64" />
                         <Skeleton className="h-6 w-24 rounded-full" />
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                         <Skeleton className="h-4 w-24" />
                         <Skeleton className="h-4 w-48" />
                       </div>
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-32 rounded-lg" />
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-48 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Main Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Identity Skeleton */}
                <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="flex flex-col md:flex-row gap-6">
                    <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={i === 4 ? "md:col-span-2" : ""}>
                          <Skeleton className="h-3 w-32 mb-2" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Skeleton */}
                <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                       {[...Array(4)].map((_, i) => (
                         <div key={i}>
                           <Skeleton className="h-3 w-24 mb-2" />
                           <Skeleton className="h-5 w-full" />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Docs Skeleton */}
                <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="p-2 space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="w-8 h-8 rounded-lg" />
                          <Skeleton className="w-8 h-8 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Notes Skeleton */}
                <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden h-96 flex flex-col">
                   <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                     <Skeleton className="h-6 w-48" />
                   </div>
                   <div className="p-6 flex-1 space-y-4">
                     <Skeleton className="h-24 w-full rounded-xl" />
                   </div>
                   <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                     <Skeleton className="h-12 w-full rounded-lg" />
                   </div>
                </div>

                {/* Audit Skeleton */}
                <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                  <Skeleton className="h-6 w-32 mb-6" />
                  <div className="space-y-6 pl-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                        <div className="space-y-1 w-full">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
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
        {/* Header Section */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-4">
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 transition-colors" onClick={() => navigate('/super-admin/dashboard')}>Admin</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 transition-colors" onClick={() => navigate('/super-admin/applications')}>Queue</span>
            <ChevronRight size={14} />
            <span className="text-blue-500">Application Details</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3">
                 <button 
                  onClick={() => navigate('/super-admin/applications')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    {application.institution}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentStyles.bg} ${currentStyles.color}`}>
                      {appStatus}
                    </span>
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                    <span className="font-mono text-gray-500">#{application.regId}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>Submitted by {application.contact.name}</span>
                  </p>
                </div>
               </div>
            </div>

            {appStatus === 'PENDING APPROVAL' ? (
              <div className="flex items-center gap-3 self-start lg:self-center">
                <button 
                  onClick={() => setModalOpen('info')}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-bold"
                >
                  Request Info
                </button>
                <button 
                  onClick={() => setModalOpen('reject')}
                  className="px-4 py-2 bg-transparent border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-bold"
                >
                  Reject
                </button>
                <button 
                  onClick={() => setModalOpen('approve')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Approve Application</span>
                </button>
              </div>
            ) : (
              <div className="self-start lg:self-center">
                {appStatus === 'APPROVED' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-bold">
                    <CheckCircle2 size={16} />
                    Application Approved
                  </div>
                )}
                {appStatus === 'REJECTED' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold">
                    <X size={16} />
                    Application Rejected
                  </div>
                )}
                {appStatus === 'NEEDS CLARIFICATION' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-bold">
                    <Info size={16} />
                    Info Requested
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Institutional Identity Card */}
            <section className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Building size={20} className="text-blue-500" />
                Institutional Identity
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo Box */}
                <div className={`w-24 h-24 rounded-xl ${application.logoColor} flex items-center justify-center text-3xl font-bold shrink-0 border border-gray-100 dark:border-white/5`}>
                  {application.logo}
                </div>
                
                {/* Details Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Legal Institution Name</label>
                    <div className="text-gray-900 dark:text-white font-medium">{application.legalName}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Institution Type</label>
                    <div className="text-gray-900 dark:text-white font-medium">{application.type}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Website URL</label>
                    <a href={`https://${application.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 font-medium">
                      {application.website}
                    </a>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Registration ID</label>
                    <div className="text-gray-900 dark:text-white font-medium">{application.regId}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Registered Address</label>
                    <div className="text-gray-700 dark:text-gray-300">{application.address}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Login Credentials Section - Visible when Approved */}
            {appStatus === 'APPROVED' && (
              <section className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Lock size={20} className="text-blue-600 dark:text-blue-400" />
                  Generated Login Credentials
                </h2>
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500">Portal Admin</span>
                    <span className="font-medium text-gray-900 dark:text-white select-all">{credentials.adminEmail}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500">Password</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white select-all">{credentials.password}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Login URL</span>
                    <a href={credentials.loginUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px]">
                      {credentials.loginUrl}
                    </a>
                  </div>
                </div>
                <button 
                  onClick={copyCredentials}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Copy size={16} />
                  Copy Credentials
                </button>
              </section>
            )}

            {/* Primary Contact Person Card */}
            <section className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <User size={20} className="text-blue-500" />
                Primary Contact Person
              </h2>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative shrink-0">
                  <img 
                    src={application.contact.avatar} 
                    alt={application.contact.name} 
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 w-full">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                    <div className="text-gray-900 dark:text-white font-medium text-lg">{application.contact.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Role / Job Title</label>
                    <div className="text-gray-900 dark:text-white font-medium">{application.contact.role}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white font-medium">{application.contact.email}</span>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} className="fill-emerald-500 text-white dark:text-[#151e32]" />
                        Verified
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white font-medium">{application.contact.phone}</span>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} className="fill-emerald-500 text-white dark:text-[#151e32]" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Submitted Documentation Card */}
            <section className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Folder size={20} className="text-blue-500" />
                  Submitted Documentation
                </h2>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 font-medium">
                  {application.documents.length} Files
                </span>
              </div>
              
              <div className="p-2 space-y-1">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-gray-100 dark:border-white/5 ${
                        doc.type === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {doc.type === 'PDF' ? <FileText size={20} /> : <ImageIcon size={20} />}
                      </div>
                      <div>
                        <div className="text-gray-700 dark:text-gray-200 font-medium text-sm">{doc.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                          {doc.size}
                          <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                          {doc.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (1/3 width) - Sidebar */}
          <div className="space-y-6">
            
            {/* Internal Review Notes */}
            <section className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-400" />
                  Internal Review Notes
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {application.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{note.text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={note.avatar} alt={note.author} className="w-6 h-6 rounded-full" />
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-900 dark:text-gray-300 font-medium">{note.author}</span> • {note.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                <div className="relative">
                  <textarea 
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add an internal note..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24 placeholder-gray-400 dark:placeholder-gray-600"
                  />
                  <button 
                    className="absolute right-3 bottom-3 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Audit Trail */}
            <section className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <History size={18} className="text-gray-400" />
                Audit Trail
              </h2>
              
              <div className="relative pl-2 space-y-8 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-800">
                {application.timeline.map((item) => (
                  <div key={item.id} className="relative pl-8">
                    {/* Timeline Dot/Icon */}
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#151e32] flex items-center justify-center z-10 ${
                      item.icon === 'check' ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-500/30' : 
                      item.icon === 'send' ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-500/30' : 
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {item.icon === 'check' ? <CheckCircle2 size={10} className="text-emerald-600 dark:text-emerald-500" /> : 
                       item.icon === 'send' ? <Send size={10} className="text-blue-600 dark:text-blue-500" /> :
                       <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{item.event}</span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.date} • {item.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;

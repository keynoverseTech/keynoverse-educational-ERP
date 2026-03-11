import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, Building2, User, FileText, Ticket, BookOpen } from 'lucide-react';

const PortalDashboard = () => {
  const navigate = useNavigate();
  const steps = [
    { id: 1, title: 'Registration Submitted', status: 'completed', date: 'Oct 12, 2023' },
    { id: 2, title: 'Documents Uploaded', subtitle: '(Logo and Accreditation Letter)', status: 'completed', date: 'Oct 14, 2023' },
    { id: 3, title: 'Payment Uploaded', status: 'in_progress', date: 'Pending' },
    { id: 4, title: 'Payment Verified', status: 'pending', date: '-' },
    { id: 5, title: 'Document Verified', status: 'pending', date: '-' },
    { id: 6, title: 'Technical Setup', status: 'pending', date: '-' },
  ];

  const currentStep = 3;
  const progressPercent = Math.round(((currentStep - 1) / steps.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Application Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your institution's onboarding progress below.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
            {progressPercent}%
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Progress</div>
            <div className="text-sm font-black text-gray-900 dark:text-white">{steps.length - (currentStep - 1)} steps remaining</div>
          </div>
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">Application Progress</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {currentStep - 1} of {steps.length} stages completed
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-[2px] bg-gray-100 dark:bg-gray-800 -z-0" />
          
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                ${step.status === 'completed' 
                  ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900/30 text-white' 
                  : step.status === 'in_progress'
                    ? 'bg-blue-600 border-blue-100 dark:border-blue-900/30 text-white animate-pulse'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300'}
              `}>
                {step.status === 'completed' ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <span className="font-black text-lg">{step.id}</span>
                )}
              </div>
              
              <div className="mt-4">
                <div className={`text-[13px] font-black leading-tight ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.title}
                </div>
                {step.subtitle && (
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    {step.subtitle}
                  </div>
                )}
                <div className="mt-1 text-[11px] font-bold text-gray-400">
                  {step.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => navigate('/portal/payments')}
                className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-center gap-4 group cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-blue-900 dark:text-blue-100">Upload Payment</div>
                  <div className="text-[11px] text-blue-700/70 dark:text-blue-300/70 font-bold">Your next pending step</div>
                </div>
                <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div
                onClick={() => navigate('/portal/documents')}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4 group cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-emerald-900 dark:text-emerald-100">Review Documents</div>
                  <div className="text-[11px] text-emerald-700/70 dark:text-emerald-300/70 font-bold">View already uploaded files</div>
                </div>
                <ArrowRight size={18} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div
                onClick={() => navigate('/portal/tickets')}
                className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-center gap-4 group cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ticket size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-amber-900 dark:text-amber-100">Submit Ticket</div>
                  <div className="text-[11px] text-amber-700/70 dark:text-amber-300/70 font-bold">Get support from our team</div>
                </div>
                <ArrowRight size={18} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div
                onClick={() => navigate('/portal/manual')}
                className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 flex items-center gap-4 group cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-purple-900 dark:text-purple-100">Open Manual</div>
                  <div className="text-[11px] text-purple-700/70 dark:text-purple-300/70 font-bold">Step-by-step onboarding guide</div>
                </div>
                <ArrowRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Institution Details Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 size={120} />
             </div>
             <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Institution Details</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institution Name</div>
                      <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">Global Technical Institute</div>
                   </div>
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Application ID</div>
                      <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">NBTE/ERP/2023/0482</div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted By</div>
                      <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5 flex items-center gap-2">
                         <User size={14} className="text-gray-400" />
                         Dr. Ahmed Musa
                      </div>
                   </div>
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</div>
                      <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                         <Clock size={12} />
                         Awaiting Payment
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20">
            <ShieldCheck size={32} className="mb-4 text-blue-200" />
            <h3 className="text-lg font-black">Need Assistance?</h3>
            <p className="text-sm text-blue-100/90 mt-2 font-medium">
              If you encounter any issues during the onboarding process, our technical team is here to help.
            </p>
            <button
              onClick={() => navigate('/portal/tickets')}
              className="mt-6 w-full py-3 bg-white text-blue-700 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">Onboarding Guide</h3>
            <div className="space-y-4">
               {[
                 { q: 'How long does verification take?', a: 'Typically 3-5 working days.' },
                 { q: 'Can I edit my registration?', a: 'Only until technical setup begins.' }
               ].map((item, i) => (
                 <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="text-xs font-black text-gray-900 dark:text-white">{item.q}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{item.a}</div>
                 </div>
               ))}
            </div>
            <button
              onClick={() => navigate('/portal/manual')}
              className="mt-5 w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-black text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Open Full Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;

import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Download, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'Paid' | 'Pending' | 'Failed';
  downloadUrl: string;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-2024-001', date: '2024-01-15', amount: 200000000, plan: 'Enterprise Plan (Yearly)', status: 'Paid', downloadUrl: '#' },
  { id: 'INV-2023-001', date: '2023-01-15', amount: 200000000, plan: 'Enterprise Plan (Yearly)', status: 'Paid', downloadUrl: '#' },
  { id: 'INV-2022-001', date: '2022-01-15', amount: 180000000, plan: 'Pro Plan (Yearly)', status: 'Paid', downloadUrl: '#' },
];

const SubscriptionPage: React.FC = () => {
  const [isRenewing, setIsRenewing] = useState(false);

  // Mock current subscription data
  const currentPlan = {
    name: 'Enterprise Plan',
    status: 'Active',
    expiryDate: '2025-01-15',
    daysLeft: 318,
    features: [
      'Unlimited Students & Staff',
      'All Modules Included',
      'Priority Support 24/7',
      'Custom Domain & Branding',
      'Advanced Analytics & Reports',
      'Daily Automated Backups'
    ]
  };

  const handleRenew = () => {
    setIsRenewing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRenewing(false);
      alert('Redirecting to payment gateway...');
    }, 1500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <CreditCard className="text-blue-600" />
          Subscription & Billing
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your institution's subscription plan and billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                      <Zap size={12} className="text-yellow-300" />
                      Current Plan
                    </span>
                    <span className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-green-100 border border-green-400/30 flex items-center gap-1.5">
                      <CheckCircle size={12} />
                      {currentPlan.status}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black mb-2">{currentPlan.name}</h2>
                  <p className="text-blue-100">Your institution is running on our most powerful plan.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-200 uppercase font-bold tracking-wider mb-1">Expires On</div>
                  <div className="text-2xl font-bold font-mono">{new Date(currentPlan.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-yellow-300">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{currentPlan.daysLeft}</div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">Days Remaining</div>
                  </div>
                </div>
                
                <button 
                  onClick={handleRenew}
                  disabled={isRenewing}
                  className="px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
                >
                  {isRenewing ? (
                    <>Processing...</>
                  ) : (
                    <>Renew Subscription <ChevronRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-600" size={20} />
              Included in your plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              Payment History
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-3">
              {mockInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{invoice.plan}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{invoice.id}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-white">₦{invoice.amount.toLocaleString()}</span>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="Download Invoice">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Need help with billing? Contact our <a href="#" className="text-blue-600 hover:underline">support team</a> or update your <a href="#" className="text-blue-600 hover:underline">payment method</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

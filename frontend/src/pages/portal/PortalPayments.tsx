import { useState } from 'react';
import { CreditCard, Copy, CheckCircle2, AlertCircle, Upload, ArrowRight, Wallet, ShieldCheck } from 'lucide-react';

const PortalPayments = () => {
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    accountNumber: '1234567890',
    accountName: 'NBTE ERP - Planets Tech Global',
    bankName: 'Access Bank',
    amount: '₦250,000.00',
    reference: 'REF-NBTE-0482'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Pay your institution's onboarding fee to activate your ERP.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
          <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Payment Awaited</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Details Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 -mr-8 -mt-8">
              <CreditCard size={200} />
           </div>
           
           <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Wallet className="text-blue-600" />
              Bank Transfer Details
           </h3>

           <div className="space-y-6 relative z-10">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount to Pay</div>
                 <div className="text-3xl font-black text-gray-900 dark:text-white">{bankDetails.amount}</div>
                 <div className="text-xs text-gray-400 mt-1 font-medium">One-time institution onboarding fee</div>
              </div>

              <div className="space-y-4">
                 <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Number</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 group">
                       <span className="text-lg font-black text-gray-900 dark:text-white">{bankDetails.accountNumber}</span>
                       <button 
                          onClick={() => copyToClipboard(bankDetails.accountNumber)}
                          className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600 transition-all"
                       >
                          {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bank Name</div>
                       <div className="p-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 font-black text-gray-900 dark:text-white text-sm">
                          {bankDetails.bankName}
                       </div>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reference</div>
                       <div className="p-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 font-black text-gray-900 dark:text-white text-sm">
                          {bankDetails.reference}
                       </div>
                    </div>
                 </div>

                 <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Name</div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 font-black text-gray-900 dark:text-white text-sm">
                       {bankDetails.accountName}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Upload Receipt Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Upload className="text-emerald-600" />
              Upload Payment Receipt
           </h3>

           <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center group hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                 <Upload size={32} />
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white">Click to upload receipt</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs font-medium">
                 Upload a clear screenshot or PDF of your bank transfer receipt. Max size: 5MB.
              </p>
              <input type="file" className="hidden" accept="image/*,.pdf" />
           </div>

           <button 
              className="mt-8 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
           >
              Submit for Verification
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Payment History/Status Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden">
         <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Payment History</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                     <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                     <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                     <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                     <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Receipt</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr className="group">
                     <td className="py-4 text-sm font-black text-gray-900 dark:text-white">-</td>
                     <td className="py-4 text-sm font-black text-gray-900 dark:text-white">₦250,000.00</td>
                     <td className="py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                           No Record
                        </span>
                     </td>
                     <td className="py-4 text-right">
                        <span className="text-xs text-gray-400 italic">No upload yet</span>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      <div className="bg-blue-600 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
               <ShieldCheck size={24} />
            </div>
            <div>
               <div className="text-lg font-black">Secure Payment Verification</div>
               <p className="text-sm text-blue-100 mt-1 font-medium max-w-xl">
                  Your payment is verified manually by our finance team. Once verified, your status will update automatically and you'll proceed to document verification.
               </p>
            </div>
         </div>
         <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors flex-shrink-0">
            View Fee Policy
         </button>
      </div>
    </div>
  );
};

export default PortalPayments;

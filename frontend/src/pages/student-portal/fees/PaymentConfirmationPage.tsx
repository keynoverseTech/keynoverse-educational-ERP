import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

type LocationState = {
  intentPayload?: Record<string, string>;
};

const PaymentConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { intentId } = useParams<{ intentId: string }>();
  const { paymentIntents, confirmPayment, actionLoading } = useStudentPortalFinance();

  const state = location.state as LocationState | null;
  const payloadFromCheckout = state?.intentPayload ?? {};

  const intent = useMemo(() => paymentIntents.find((p) => p.id === (intentId || '')), [intentId, paymentIntents]);

  const [otp, setOtp] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!intent) return;
    setConfirmError(null);
    if (!otp.trim() || otp.trim().length < 4) {
      setConfirmError('Enter the OTP to confirm your payment.');
      return;
    }
    try {
      const result = await confirmPayment({
        intentId: intent.id,
        payload: {
          ...payloadFromCheckout,
          otp: otp.trim(),
        },
      });
      navigate(`/student/fees/receipts/${result.receiptId}`, { replace: true });
    } catch (e) {
      setConfirmError(e instanceof Error ? e.message : 'Payment confirmation failed');
    }
  };

  if (!intent) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
            <CreditCard size={40} />
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Payment session not found</h2>
          <p className="text-sm text-gray-500 mb-6">Please restart the payment from your fees page.</p>
          <button
            onClick={() => navigate('/student/fees')}
            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25"
          >
            Back to Fees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            Confirm Payment
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Verify and confirm your payment to generate a receipt.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoice</p>
            <p className="text-sm font-black text-gray-900 dark:text-white font-mono">{intent.invoiceId}</p>
          </div>
          <div className="p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 text-white">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Amount</p>
            <p className="text-2xl font-black">₦{intent.amount.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-500/20 text-white">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Method</p>
            <p className="text-2xl font-black">{intent.paymentMethod}</p>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <div className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-black text-gray-900 dark:text-white"
              placeholder="Enter OTP"
              inputMode="numeric"
            />
            <p className="text-xs text-gray-500 mt-2">For demo, enter any 4+ digits.</p>
          </div>

          {confirmError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-6 flex items-start gap-3">
              <AlertCircle className="text-rose-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-black text-rose-700 dark:text-rose-300">Payment failed</p>
                <p className="text-xs text-rose-700/80 dark:text-rose-200/80 mt-1">{confirmError}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/student/fees')}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={actionLoading}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;


import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle2, Building2, Wallet, ArrowRight } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';
import type { StudentPortalPaymentMethod } from '../../../api/studentPortalFinanceApi';

type FieldErrors = Partial<Record<'amount' | 'method' | 'email' | 'phone' | 'reference' | 'bank', string>>;

const PaymentCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { getInvoiceById, initiatePayment, actionLoading, error } = useStudentPortalFinance();

  const invId = invoiceId || '';
  const invoice = getInvoiceById(invId);

  const [amount, setAmount] = useState<number>(() => invoice?.balance ?? 0);
  const [paymentMethod, setPaymentMethod] = useState<StudentPortalPaymentMethod>('Transfer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reference, setReference] = useState('');
  const [bank, setBank] = useState('Zenith Bank');
  const [errors, setErrors] = useState<FieldErrors>({});

  const balance = invoice?.balance ?? 0;
  const canPay = Boolean(invoice) && balance > 0;

  const preview = useMemo(() => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    const nextBalance = invoice ? Math.max(0, invoice.balance - safeAmount) : 0;
    return { safeAmount, nextBalance };
  }, [amount, invoice]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!invoice) next.amount = 'Invoice not found';
    if (!Number.isFinite(amount) || amount <= 0) next.amount = 'Enter a valid amount';
    if (invoice && amount > invoice.balance) next.amount = 'Amount cannot be higher than your balance';
    if (!paymentMethod) next.method = 'Select a payment method';

    if (paymentMethod === 'Online') {
      if (!email.trim() || !email.includes('@')) next.email = 'Enter a valid email';
      if (!phone.trim() || phone.trim().length < 8) next.phone = 'Enter a valid phone number';
    }

    if (paymentMethod === 'Transfer') {
      if (!bank.trim()) next.bank = 'Select a bank';
      if (!reference.trim() || reference.trim().length < 6) next.reference = 'Enter your transfer reference';
    }

    if (paymentMethod === 'POS') {
      if (!reference.trim() || reference.trim().length < 6) next.reference = 'Enter POS reference';
    }

    if (paymentMethod === 'Cash') {
      if (!reference.trim() || reference.trim().length < 3) next.reference = 'Enter teller name or note';
    }

    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!invoice) return;

    const intent = await initiatePayment({ invoiceId: invoice.id, amount: preview.safeAmount, paymentMethod });
    navigate(`/student/fees/pay/confirm/${intent.id}`, {
      state: {
        intentPayload: {
          email: email.trim(),
          phone: phone.trim(),
          reference: reference.trim(),
          bank: bank.trim(),
        },
      },
    });
  };

  if (!invoice) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
            <Building2 size={40} />
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Invoice not found</h2>
          <p className="text-sm text-gray-500 mb-6">You can go back to your fee dashboard.</p>
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
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] p-6 flex items-start gap-3">
          <AlertCircle className="text-rose-600 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-black text-rose-700 dark:text-rose-300">Payment error</p>
            <p className="text-xs text-rose-700/80 dark:text-rose-200/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              Payment Checkout
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Invoice: <span className="font-mono">{invoice.id}</span></p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Amount (₦)</label>
              <input
                type="number"
                value={Number.isFinite(amount) ? amount : 0}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={balance}
                disabled={!canPay}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-black text-gray-900 dark:text-white disabled:opacity-50"
              />
              {errors.amount && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.amount}</p>}
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Method</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['Transfer', 'Online', 'POS', 'Cash'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === m
                        ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900/40 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    <p className="text-xs font-black text-gray-900 dark:text-white">{m}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Method</p>
                  </button>
                ))}
              </div>
              {errors.method && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.method}</p>}
            </div>

            {paymentMethod === 'Transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Receiving Bank</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                  >
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="GTBank">GTBank</option>
                    <option value="First Bank">First Bank</option>
                  </select>
                  {errors.bank && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.bank}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transfer Reference</label>
                  <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold text-gray-900 dark:text-white"
                    placeholder="e.g. TRX-123456"
                  />
                  {errors.reference && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.reference}</p>}
                </div>
              </div>
            )}

            {paymentMethod === 'Online' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                    placeholder="student@email.com"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                    placeholder="e.g. 08000000000"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.phone}</p>}
                </div>
              </div>
            )}

            {paymentMethod === 'POS' && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">POS Reference</label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. POS-123456"
                />
                {errors.reference && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.reference}</p>}
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Teller Name / Note</label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. Cash payment at bursary"
                />
                {errors.reference && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.reference}</p>}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(`/student/fees/invoices/${invoice.id}`)}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                View Invoice
              </button>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!canPay || actionLoading}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                <Wallet size={18} />
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm p-8 h-fit">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Summary</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Invoice Total</span>
              <span className="text-sm font-black text-gray-900 dark:text-white">₦{invoice.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Already Paid</span>
              <span className="text-sm font-black text-emerald-600">₦{invoice.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Balance</span>
              <span className="text-sm font-black text-amber-600">₦{invoice.balance.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Paying Now</span>
                <span className="text-lg font-black text-gray-900 dark:text-white">₦{preview.safeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-gray-500">Remaining</span>
                <span className="text-sm font-black text-gray-900 dark:text-white">₦{preview.nextBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">Secure payment flow</p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 mt-1">
                  Your receipt is generated immediately after confirmation.
                </p>
              </div>
            </div>
          </div>

          {!canPay && (
            <div className="mt-6 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-gray-500 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">No outstanding balance</p>
                  <p className="text-xs text-gray-500 mt-1">This invoice is already settled.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckoutPage;


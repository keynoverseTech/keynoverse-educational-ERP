import React, { useState } from 'react';
import { CreditCard, Search, Plus, RefreshCw, Printer, CheckCircle2, AlertCircle, TrendingUp, X } from 'lucide-react';
import { useFinance, type Payment } from '../../../../state/financeContext';
// import { useHR } from '../../../state/hrAccessControl';

const PaymentsPage: React.FC = () => {
  const { payments, setPayments, invoices, setInvoices } = useFinance();
  // const { hasPermission } = useHR();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Posted' | 'Reversed'>('All');
  
  // Payment Form State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'POS' | 'Online'>('Cash');
  const [transactionRef, setTransactionRef] = useState('');

  const filteredPayments = payments
    .filter(pay => {
      const matchesSearch = pay.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pay.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.transactionReference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || pay.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

  const handleRecordPayment = () => {
    if (!selectedInvoiceId || amountPaid <= 0) return;

    const newPayment: Payment = {
      id: `pay_${crypto.randomUUID()}`,
      invoiceId: selectedInvoiceId,
      amountPaid,
      paymentMethod,
      transactionReference: transactionRef || `REF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      recordedBy: 'current_staff', // Should come from auth context
      createdAt: new Date().toISOString(),
      status: 'Posted'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update Invoice Status
    const invoice = invoices.find(inv => inv.id === selectedInvoiceId);
    if (invoice) {
      const currentPaid = payments
        .filter(p => p.invoiceId === invoice.id && p.status === 'Posted')
        .reduce((sum, p) => sum + p.amountPaid, 0);
      
      const newTotalPaid = currentPaid + amountPaid;
      let newStatus: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Partially Paid';
      
      if (newTotalPaid >= invoice.totalAmount) newStatus = 'Paid';
      if (newTotalPaid === 0) newStatus = 'Unpaid';

      setInvoices(prev => prev.map(inv => 
        inv.id === invoice.id ? { ...inv, status: newStatus } : inv
      ));
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleReversePayment = (paymentId: string) => {
    if (!window.confirm('Are you sure you want to REVERSE this transaction? This action cannot be undone.')) return;

    // Mark payment as Reversed
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'Reversed' } : p
    ));

    // Recalculate Invoice Status
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      const invoice = invoices.find(inv => inv.id === payment.invoiceId);
      if (invoice) {
        // Calculate what the paid amount WAS before reversal (excluding this one)
        const otherPayments = payments
          .filter(p => p.invoiceId === invoice.id && p.status === 'Posted' && p.id !== paymentId)
          .reduce((sum, p) => sum + p.amountPaid, 0);

        let newStatus: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Partially Paid';
        if (otherPayments >= invoice.totalAmount) newStatus = 'Paid';
        if (otherPayments === 0) newStatus = 'Unpaid';

        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { ...inv, status: newStatus } : inv
        ));
      }
    }
  };

  const resetForm = () => {
    setSelectedInvoiceId('');
    setAmountPaid(0);
    setPaymentMethod('Cash');
    setTransactionRef('');
  };

  const getStatusStyle = (status: Payment['status']) => {
    switch (status) {
      case 'Posted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Reversed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const postedCount = payments.filter(p => p.status === 'Posted').length;
  const reversedCount = payments.filter(p => p.status === 'Reversed').length;
  const totalPostedAmount = payments.filter(p => p.status === 'Posted').reduce((sum, p) => sum + p.amountPaid, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayPostedAmount = payments
    .filter(p => p.status === 'Posted' && (p.createdAt || '').startsWith(today))
    .reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Payments & Receipts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Record payments, issue receipts, and manage transaction history.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25"
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted Payments</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{postedCount}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reversed</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{reversedCount}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted Amount</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totalPostedAmount.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">Today: ₦{todayPostedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ref, invoice ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Posted', 'Reversed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterStatus === status 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.length > 0 ? (
          filteredPayments.map(pay => (
            <div key={pay.id} className={`bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative ${pay.status === 'Reversed' ? 'opacity-90' : ''}`}>
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${pay.status === 'Posted' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusStyle(pay.status)}`}>
                    {pay.status}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">₦{pay.amountPaid.toLocaleString()}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">{pay.transactionReference}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Invoice</span>
                  <span className="font-mono text-emerald-600">{pay.invoiceId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Method</span>
                  <span className="font-black text-gray-900 dark:text-white">{pay.paymentMethod}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 uppercase tracking-widest font-black">Date</span>
                    <span className="font-bold text-gray-600 dark:text-gray-300">{new Date(pay.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
                  title="Print Receipt"
                >
                  <Printer size={14} /> Print
                </button>
                {pay.status === 'Posted' ? (
                  <button
                    onClick={() => handleReversePayment(pay.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl text-[10px] font-black hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                    title="Reverse Transaction"
                  >
                    <RefreshCw size={14} /> Reverse
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-900/60 text-gray-400 rounded-2xl text-[10px] font-black cursor-not-allowed"
                    title="This transaction is reversed"
                  >
                    <RefreshCw size={14} /> Reversed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <CreditCard size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Payments Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Record Payment</h2>
                <p className="text-sm text-gray-500 mt-1">Post a payment against an invoice.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl shadow-sm transition-all"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Invoice</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => {
                    setSelectedInvoiceId(e.target.value);
                    // Auto-fill remaining amount
                    const inv = invoices.find(i => i.id === e.target.value);
                    if (inv) {
                      const paid = payments
                        .filter(p => p.invoiceId === inv.id && p.status === 'Posted')
                        .reduce((sum, p) => sum + p.amountPaid, 0);
                      setAmountPaid(inv.totalAmount - paid);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                >
                  <option value="">-- Select Invoice --</option>
                  {invoices.filter(inv => inv.status !== 'Paid').map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.id} - {inv.studentId} (₦{inv.totalAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount Paid (₦)</label>
                <input 
                  type="number" 
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Payment['paymentMethod'])}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Bank Transfer</option>
                  <option value="POS">POS Terminal</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction Reference</label>
                <input 
                  type="text" 
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. TRX-12345678"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRecordPayment}
                  disabled={!selectedInvoiceId || amountPaid <= 0}
                  className="px-10 py-4 text-white bg-emerald-600 rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Post Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

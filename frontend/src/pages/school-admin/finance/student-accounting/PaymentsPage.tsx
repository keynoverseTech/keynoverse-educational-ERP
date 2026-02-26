import React, { useState } from 'react';
import { CreditCard, Search, Plus, RefreshCw, Printer } from 'lucide-react';
import { useFinance, type Payment } from '../../../../state/financeContext';
// import { useHR } from '../../../state/hrAccessControl';

const PaymentsPage: React.FC = () => {
  const { payments, setPayments, invoices, setInvoices } = useFinance();
  // const { hasPermission } = useHR();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Payment Form State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'POS' | 'Online'>('Cash');
  const [transactionRef, setTransactionRef] = useState('');

  const filteredPayments = payments.filter(pay => 
    pay.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pay.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordPayment = () => {
    if (!selectedInvoiceId || amountPaid <= 0) return;

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      invoiceId: selectedInvoiceId,
      amountPaid,
      paymentMethod,
      transactionReference: transactionRef || `REF-${Date.now()}`,
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-blue-600" />
            Payments & Receipts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Record payments, issue receipts, and manage transaction history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search ref, invoice ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Invoice ID</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPayments.map(pay => (
                <tr key={pay.id} className={`hover:bg-gray-50 dark:hover:bg-gray-900/30 ${pay.status === 'Reversed' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{pay.transactionReference}</td>
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{pay.invoiceId}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{pay.paymentMethod}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₦{pay.amountPaid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      pay.status === 'Posted' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 line-through'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Print Receipt">
                        <Printer size={16} />
                      </button>
                      {pay.status === 'Posted' && (
                        <button 
                          onClick={() => handleReversePayment(pay.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" 
                          title="Reverse Transaction"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No payment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Record Payment</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Invoice</label>
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Paid (₦)</label>
                <input 
                  type="number" 
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Bank Transfer</option>
                  <option value="POS">POS Terminal</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Reference</label>
                <input 
                  type="text" 
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. TRX-12345678"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRecordPayment}
                  disabled={!selectedInvoiceId || amountPaid <= 0}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
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

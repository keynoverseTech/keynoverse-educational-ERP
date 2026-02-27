import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Printer, RefreshCw, AlertCircle, CheckCircle2, TrendingUp, Receipt } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { myPayments } = useStudentPortalFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Posted' | 'Reversed'>('All');

  const totals = useMemo(() => {
    const posted = myPayments.filter((p) => p.status === 'Posted');
    const reversed = myPayments.filter((p) => p.status === 'Reversed');
    return {
      postedCount: posted.length,
      reversedCount: reversed.length,
      totalPostedAmount: posted.reduce((sum, p) => sum + p.amountPaid, 0),
    };
  }, [myPayments]);

  const filteredPayments = useMemo(() => {
    return myPayments.filter((p) => {
      const matchesSearch = p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) || p.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, myPayments, searchTerm]);

  const getStatusStyle = (status: 'Posted' | 'Reversed') => {
    switch (status) {
      case 'Posted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Payment History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Track all your posted and reversed payments.</p>
        </div>
        <button
          onClick={() => navigate('/student/fees/receipts')}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Receipt size={18} />
          Receipts
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
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totals.postedCount}</h3>
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
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totals.reversedCount}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Posted</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totals.totalPostedAmount.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search reference or invoice..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Posted', 'Reversed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterStatus === status ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((pay) => (
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
                  <span className="font-mono text-blue-600">{pay.invoiceId}</span>
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
                  onClick={() => navigate(`/student/fees/invoices/${pay.invoiceId}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
                >
                  <RefreshCw size={14} /> Invoice
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl text-[10px] font-black hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                  title="Print"
                >
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <CreditCard size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Payments</h3>
            <p className="text-sm text-gray-500">Your payment history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;


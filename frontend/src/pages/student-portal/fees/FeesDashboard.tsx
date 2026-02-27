import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Eye, ArrowRight, AlertCircle, CheckCircle2, Clock, TrendingUp, Receipt } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

const FeesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { student, myInvoices, myPayments, invoicesLoading, paymentsLoading, actionLoading, error, refresh } = useStudentPortalFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Unpaid' | 'Partially Paid' | 'Paid'>('All');

  const totals = useMemo(() => {
    const outstanding = myInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const dueCount = myInvoices.filter((inv) => inv.balance > 0).length;
    const paidCount = myInvoices.filter((inv) => inv.status === 'Paid').length;
    const totalPaid = myPayments.filter((p) => p.status === 'Posted').reduce((sum, p) => sum + p.amountPaid, 0);
    return { outstanding, dueCount, paidCount, totalPaid };
  }, [myInvoices, myPayments]);

  const filteredInvoices = useMemo(() => {
    return myInvoices.filter((inv) => {
      const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || inv.session.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, myInvoices, searchTerm]);

  const getStatusStyle = (status: 'Unpaid' | 'Partially Paid' | 'Paid') => {
    switch (status) {
      case 'Unpaid': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Partially Paid': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Fees & Payments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your invoices, payments, and receipts. Student ID: <span className="font-mono">{student.id}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/student/fees/receipts')}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Receipt size={18} />
          View Receipts
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-rose-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-black text-rose-700 dark:text-rose-300">Unable to load fee data</p>
              <p className="text-xs text-rose-700/80 dark:text-rose-200/80 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => void refresh()}
            className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rose-500/25"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outstanding Balance</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totals.outstanding.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">Invoices due: {totals.dueCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid Invoices</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totals.paidCount}</h3>
              <p className="text-xs text-gray-500 mt-1">Payments posted</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totals.totalPaid.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search invoice ID or session..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Unpaid', 'Partially Paid', 'Paid'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterStatus === status ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {(invoicesLoading || paymentsLoading || actionLoading) && (
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 flex items-center justify-center text-sm text-gray-500">
          Loading your fee data...
        </div>
      )}

      {!invoicesLoading && !paymentsLoading && !actionLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv) => (
              <div key={inv.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${
                  inv.status === 'Paid' ? 'bg-emerald-500' : inv.status === 'Partially Paid' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusStyle(inv.status)}`}>
                      {inv.status}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{inv.session}</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">{inv.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <CreditCard size={20} className="text-gray-400" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Total</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">₦{inv.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Paid</span>
                    <span className="text-sm font-black text-emerald-600">₦{inv.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Balance</span>
                    <span className={`text-sm font-black ${inv.balance > 0 ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                      ₦{inv.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 uppercase tracking-widest font-black">Created</span>
                      <span className="font-bold text-gray-600 dark:text-gray-300">{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/student/fees/invoices/${inv.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
                  >
                    <Eye size={14} /> View Details
                  </button>

                  {inv.balance > 0 ? (
                    <button
                      onClick={() => navigate(`/student/fees/pay/${inv.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Pay Now <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-900/60 text-gray-400 rounded-2xl text-[10px] font-black cursor-not-allowed"
                    >
                      Paid
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Invoices</h3>
              <p className="text-sm text-gray-500">No invoices found for your account.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeesDashboard;


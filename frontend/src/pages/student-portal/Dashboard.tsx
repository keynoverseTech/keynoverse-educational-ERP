import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, CreditCard, GraduationCap, TrendingUp, AlertCircle, ArrowRight, Receipt } from 'lucide-react';
import { useStudentPortalFinance } from '../../state/studentPortalFinanceContext';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { student, myInvoices, myPayments } = useStudentPortalFinance();

  const totals = useMemo(() => {
    const outstanding = myInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const dueCount = myInvoices.filter((inv) => inv.balance > 0).length;
    const postedPayments = myPayments.filter((p) => p.status === 'Posted');
    const totalPaid = postedPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const lastPayment = postedPayments[0];
    return { outstanding, dueCount, totalPaid, lastPayment };
  }, [myInvoices, myPayments]);

  const today = new Date();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            Student Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {student.fullName} • {student.programme} • Level {student.level}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/fees')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
          >
            Go to Fees
          </button>
          <button
            onClick={() => navigate('/student/fees/receipts')}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Receipt size={18} />
            Receipts
          </button>
        </div>
      </div>

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
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totals.totalPaid.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{today.toLocaleDateString()}</h3>
              <p className="text-xs text-gray-500 mt-1">{today.toLocaleDateString(undefined, { weekday: 'long' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" />
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/student/fees')}
              className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fees</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-2 flex items-center justify-between">
                View invoices <ArrowRight size={18} className="text-gray-400" />
              </p>
            </button>
            <button
              onClick={() => navigate('/student/fees/history')}
              className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payments</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-2 flex items-center justify-between">
                Payment history <ArrowRight size={18} className="text-gray-400" />
              </p>
            </button>
            <button
              onClick={() => navigate('/student/courses')}
              className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courses</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-2 flex items-center justify-between">
                Registered courses <ArrowRight size={18} className="text-gray-400" />
              </p>
            </button>
            <button
              onClick={() => navigate('/student/timetable')}
              className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timetable</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-2 flex items-center justify-between">
                Weekly schedule <ArrowRight size={18} className="text-gray-400" />
              </p>
            </button>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Payments Snapshot</h3>
            <p className="text-indigo-100 mb-8 max-w-md">View your latest payment status and download receipts.</p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
              <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-1">Last Payment</p>
              {totals.lastPayment ? (
                <>
                  <p className="text-3xl font-black">₦{totals.lastPayment.amountPaid.toLocaleString()}</p>
                  <p className="text-sm text-indigo-100 mt-2 font-mono">{totals.lastPayment.transactionReference}</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black">₦0</p>
                  <p className="text-sm text-indigo-100 mt-2">No payments yet</p>
                </>
              )}
            </div>

            {totals.outstanding > 0 ? (
              <button
                onClick={() => navigate('/student/fees')}
                className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Pay Outstanding Fees
              </button>
            ) : (
              <div className="mt-8 w-full py-4 bg-white/10 text-white rounded-2xl font-black flex items-center justify-center gap-2 border border-white/10">
                <AlertCircle size={18} />
                No outstanding fees
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

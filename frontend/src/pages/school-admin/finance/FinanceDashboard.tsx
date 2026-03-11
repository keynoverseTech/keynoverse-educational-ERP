import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpen,
  CreditCard,
  DollarSign,
  FileText,
  Landmark,
  PieChart,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useFinance } from '../../../state/financeContext';

const formatNaira = (value: number) => {
  return `₦${value.toLocaleString()}`;
};

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const { invoices, payments, ledgerTransactions, bankAccounts, payrollRuns } = useFinance();

  const studentTotals = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = payments.filter((p) => p.status === 'Posted').reduce((sum, p) => sum + p.amountPaid, 0);
    const outstanding = Math.max(0, totalInvoiced - totalCollected);
    const collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;
    return { totalInvoiced, totalCollected, outstanding, collectionRate };
  }, [invoices, payments]);

  const ledgerTotals = useMemo(() => {
    const income = ledgerTransactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expense = ledgerTransactions.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [ledgerTransactions]);

  const payrollTotals = useMemo(() => {
    const total = payrollRuns.reduce((sum, run) => sum + run.totalAmount, 0);
    const disbursed = payrollRuns.filter((run) => run.status === 'Disbursed').reduce((sum, run) => sum + run.totalAmount, 0);
    return { total, disbursed, count: payrollRuns.length };
  }, [payrollRuns]);

  const recentPayments = useMemo(() => {
    return [...payments]
      .filter((p) => p.status === 'Posted')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [payments]);

  const recentLedger = useMemo(() => {
    return [...ledgerTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [ledgerTransactions]);

  const stats = [
    {
      label: 'Student Collections',
      value: formatNaira(studentTotals.totalCollected),
      trend: `${studentTotals.collectionRate.toFixed(0)}% collection rate`,
      trendUp: true,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      label: 'Outstanding Invoices',
      value: formatNaira(studentTotals.outstanding),
      trend: `${invoices.length} invoices`,
      trendUp: false,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      label: 'Ledger Net',
      value: formatNaira(ledgerTotals.net),
      trend: ledgerTotals.net >= 0 ? 'Net positive' : 'Net deficit',
      trendUp: ledgerTotals.net >= 0,
      icon: PieChart,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Bank Accounts',
      value: bankAccounts.length.toString(),
      trend: bankAccounts.some((a) => a.isDefault) ? 'Default set' : 'No default',
      trendUp: true,
      icon: Landmark,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Finance Module
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-7 h-7" />
              Finance Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-2xl">
              Overall overview of bank accounts, student accounting, and administrative accounting.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/school-admin/finance/accounts')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-2"
            >
              <Landmark size={16} /> Bank Accounts
            </button>
            <button
              onClick={() => navigate('/school-admin/finance/student-accounting/invoices')}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              <FileText size={16} /> Student Invoices
            </button>
            <button
              onClick={() => navigate('/school-admin/finance/administrative-accounting/ledger')}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              <BookOpen size={16} /> General Ledger
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg transition-all duration-300">
            <div className={`absolute inset-x-0 top-0 h-1 ${
              stat.label === 'Student Collections'
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500'
                : stat.label === 'Outstanding Invoices'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
                  : stat.label === 'Ledger Net'
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
                    : 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500'
            }`} />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Ledger Activity</h3>
            <button
              onClick={() => navigate('/school-admin/finance/administrative-accounting/ledger')}
              className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wide flex items-center gap-1"
            >
              View Ledger <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentLedger.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${tx.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'Income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500 font-medium">{new Date(tx.date).toLocaleDateString()} • {tx.accountName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'Income' ? '+' : '-'}{formatNaira(tx.amount)}
                  </p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{tx.paymentMethod}</span>
                </div>
              </div>
            ))}
            {recentLedger.length === 0 && (
              <div className="text-center py-10 text-gray-500">No ledger activity yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Accounting</h3>
            <button
              onClick={() => navigate('/school-admin/finance/student-accounting/invoices')}
              className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wide flex items-center gap-1"
            >
              View Invoices <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                  <Banknote size={20} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Invoiced</span>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-3">{formatNaira(studentTotals.totalInvoiced)}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{invoices.length} invoice(s)</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                  <CreditCard size={20} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Collected</span>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-3">{formatNaira(studentTotals.totalCollected)}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{studentTotals.collectionRate.toFixed(0)}% collection rate</p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wide">Recent Payments</p>
                <button
                  onClick={() => navigate('/school-admin/finance/student-accounting/payments')}
                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-wide"
                >
                  Payments
                </button>
              </div>
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.invoiceId}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{new Date(p.createdAt).toLocaleDateString()} • {p.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">{formatNaira(p.amountPaid)}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{p.status}</p>
                    </div>
                  </div>
                ))}
                {recentPayments.length === 0 && (
                  <div className="text-center py-6 text-gray-500">No payments recorded.</div>
                )}
              </div>
            </div>

            {payrollTotals.count > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Payroll</p>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{payrollTotals.count} run(s)</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{formatNaira(payrollTotals.disbursed)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;


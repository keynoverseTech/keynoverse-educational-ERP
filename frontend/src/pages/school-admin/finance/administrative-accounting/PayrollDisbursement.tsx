import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Users,
  Search,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useFinance } from '../../../../state/financeContext';
import type { PayrollRun } from '../../../../state/financeContext';

const PayrollDisbursement: React.FC = () => {
  const { payrollRuns, setPayrollRuns, setLedgerTransactions } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Disbursed'>('All');
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRuns = payrollRuns.filter(run => {
    const matchesSearch = run.month.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         run.year.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || run.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.forwardedAt || '').getTime() - new Date(a.forwardedAt || '').getTime());

  const handleApprove = (id: string) => {
    setPayrollRuns(prev => prev.map(run => 
      run.id === id ? { ...run, status: 'Approved' } : run
    ));
  };

  const handleDisburse = (run: PayrollRun) => {
    if (!window.confirm(`Are you sure you want to disburse ₦${run.totalAmount.toLocaleString()} for ${run.month} ${run.year}?`)) {
      return;
    }

    // 1. Update Payroll Run status
    setPayrollRuns(prev => prev.map(r => 
      r.id === run.id ? { 
        ...r, 
        status: 'Disbursed', 
        disbursedAt: new Date().toISOString(),
        disbursedBy: 'Finance Officer' // Replace with actual user
      } : r
    ));

    // 2. Record in General Ledger as an expense
    setLedgerTransactions(prev => [
      {
        id: `trx_${crypto.randomUUID()}`,
        accountName: 'School Main Account',
        reference: `PAYROLL-${run.month.toUpperCase()}-${run.year}`,
        date: new Date().toISOString().split('T')[0],
        amount: run.totalAmount,
        paymentMethod: 'Bank Transfer',
        description: `Staff Salary Disbursement for ${run.month} ${run.year} (${run.totalStaff} staff members)`,
        type: 'Expense',
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    alert(`Payroll disbursed successfully. Transaction recorded in General Ledger.`);
  };

  const getStatusStyle = (status: PayrollRun['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Approved': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Disbursed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
            Payroll Disbursement
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Review and disburse staff salaries forwarded from Human Resources.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Approval</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {payrollRuns.filter(r => r.status === 'Pending').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ready to Pay</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {payrollRuns.filter(r => r.status === 'Approved').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid this Month</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                ₦{payrollRuns
                  .filter(r => r.status === 'Disbursed' && r.month === new Date().toLocaleString('default', { month: 'long' }))
                  .reduce((sum, r) => sum + r.totalAmount, 0)
                  .toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search payroll month or year..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Pending', 'Approved', 'Disbursed'] as const).map(status => (
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

      {/* Payroll Runs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRuns.length > 0 ? (
          filteredRuns.map(run => (
            <div key={run.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${
                run.status === 'Disbursed' ? 'bg-emerald-500' : run.status === 'Approved' ? 'bg-blue-500' : 'bg-amber-500'
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusStyle(run.status)}`}>
                    {run.status}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{run.month} {run.year}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">ID: {run.id.split('_')[1]}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <FileText size={20} className="text-gray-400" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users size={14} />
                    <span className="text-xs font-bold">Staff Count</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{run.totalStaff}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <TrendingUp size={14} />
                    <span className="text-xs font-bold">Total Payout</span>
                  </div>
                  <span className="text-sm font-black text-emerald-600">₦{run.totalAmount.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 uppercase tracking-widest font-black">Forwarded By</span>
                    <span className="font-bold text-gray-600 dark:text-gray-300">{run.generatedBy}</span>
                  </div>
                  {run.status === 'Disbursed' && (
                    <div className="flex justify-between items-center text-[10px] mt-2">
                      <span className="text-gray-400 uppercase tracking-widest font-black">Paid Date</span>
                      <span className="font-bold text-emerald-600">{new Date(run.disbursedAt || '').toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedRun(run);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
                >
                  <Eye size={14} /> View Details
                </button>
                
                {run.status === 'Pending' && (
                  <button 
                    onClick={() => handleApprove(run.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Approve Run
                  </button>
                )}

                {run.status === 'Approved' && (
                  <button 
                    onClick={() => handleDisburse(run)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Disburse <ArrowRight size={14} />
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
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Payroll Runs</h3>
            <p className="text-sm text-gray-500">Awaiting payroll data from Human Resources.</p>
          </div>
        )}
      </div>

      {/* Payroll Details Modal */}
      {isModalOpen && selectedRun && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusStyle(selectedRun.status)}`}>
                  {selectedRun.status}
                </span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-3">
                  Payroll Details: {selectedRun.month} {selectedRun.year}
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedRun.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl shadow-sm transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Staff</p>
                  <p className="text-2xl font-black text-blue-900 dark:text-white">{selectedRun.totalStaff}</p>
                </div>
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Net Payout</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-white">₦{selectedRun.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Forwarded On</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(selectedRun.forwardedAt || '').toLocaleDateString()}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Staff Member</th>
                      <th className="px-6 py-4 text-right">Base Salary</th>
                      <th className="px-6 py-4 text-right">Allowances</th>
                      <th className="px-6 py-4 text-right">Deductions</th>
                      <th className="px-6 py-4 text-right">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {selectedRun.staffEntries.map((entry, idx) => (
                      <tr key={idx} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">{entry.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{entry.staffId}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-400">
                          ₦{entry.baseSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                          +₦{entry.allowances.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-rose-600">
                          -₦{entry.deductions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">
                          ₦{entry.netPay.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                Close
              </button>
              {selectedRun.status === 'Pending' && (
                <button 
                  onClick={() => {
                    handleApprove(selectedRun.id);
                    setIsModalOpen(false);
                  }}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25"
                >
                  Approve Payroll Run
                </button>
              )}
              {selectedRun.status === 'Approved' && (
                <button 
                  onClick={() => {
                    handleDisburse(selectedRun);
                    setIsModalOpen(false);
                  }}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25"
                >
                  Disburse Salaries
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollDisbursement;

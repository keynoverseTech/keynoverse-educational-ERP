import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  CreditCard,
  Paperclip,
  Trash2,
  X,
  Save,
  AlertCircle,
  Eye,
  Building2
} from 'lucide-react';
import { useFinance } from '../../../../state/financeContext';
import type { LedgerTransaction } from '../../../../state/financeTypes';

interface LedgerFormData {
  accountName: string;
  reference: string;
  date: string;
  amount: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque' | 'Card' | 'Payment Gateways';
  description: string;
  attachment: File | null;
  type: 'Income' | 'Expense';
}

const GeneralLedger: React.FC = () => {
  const { ledgerTransactions, setLedgerTransactions } = useFinance();
  
  const [activeView, setActiveView] = useState<'list' | 'add'>('list');
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<LedgerFormData>({
    accountName: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMethod: 'Bank Transfer',
    description: '',
    attachment: null,
    type: 'Income'
  });

  const filteredTransactions = useMemo(() => {
    return ledgerTransactions.filter(t => {
      const matchesType = filterType === 'All' || t.type === filterType;
      const matchesSearch = 
        t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.accountName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [ledgerTransactions, filterType, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: LedgerTransaction = {
      id: `trx_${crypto.randomUUID()}`,
      accountName: formData.accountName,
      reference: formData.reference,
      date: formData.date,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      description: formData.description,
      attachment: formData.attachment ? formData.attachment.name : undefined,
      type: formData.type,
      createdAt: new Date().toISOString()
    };

    setLedgerTransactions(prev => [newTransaction, ...prev]);
    setActiveView('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      accountName: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      paymentMethod: 'Bank Transfer',
      description: '',
      attachment: null,
      type: 'Income'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setLedgerTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            General Ledger
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Record and monitor all school bank account transactions in one place.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setActiveView(activeView === 'list' ? 'add' : 'list')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25"
          >
            {activeView === 'list' ? <Plus size={20} /> : <X size={20} />}
            {activeView === 'list' ? 'Record Transaction' : 'Cancel'}
          </button>
        </div>
      </div>

      {activeView === 'list' ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Income</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totalIncome.toLocaleString()}</h3>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[70%]" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">₦{totalExpense.toLocaleString()}</h3>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[45%]" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Net Balance</p>
                  <h3 className={`text-2xl font-black ${totalIncome - totalExpense >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                    ₦{(totalIncome - totalExpense).toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[60%]" />
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by reference, account or description..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
              {(['All', 'Income', 'Expense'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    filterType === type 
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Ref</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank Account</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${t.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {t.type === 'Income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(t.date).toLocaleDateString()}</p>
                              <p className="text-[10px] font-mono text-gray-400">{t.reference}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-gray-400" />
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{t.accountName}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{t.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {t.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-black ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {t.type === 'Income' ? '+' : '-'}₦{t.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {t.attachment && (
                              <div className="p-2 text-indigo-400" title={`Attachment: ${t.attachment}`}>
                                <Paperclip size={16} />
                              </div>
                            )}
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <AlertCircle size={40} className="text-gray-200" />
                          <p className="text-sm text-gray-500 font-bold">No transactions recorded yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-xl shadow-gray-200/30">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <Plus size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">New Transaction</h2>
              <p className="text-sm text-gray-500 font-medium">Record a new bank transaction into the ledger.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Income' }))}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black transition-all ${
                  formData.type === 'Income'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-transparent text-gray-400 hover:text-emerald-600'
                }`}
              >
                <TrendingUp size={20} /> Income
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Expense' }))}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black transition-all ${
                  formData.type === 'Expense'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-transparent text-gray-400 hover:text-rose-600'
                }`}
              >
                <TrendingDown size={20} /> Expense
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Name</label>
                <div className="relative">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Zenith Bank - Main"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.accountName}
                    onChange={e => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2024-001"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={formData.reference}
                  onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Date</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold text-indigo-600 text-xl"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Via</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {(['Bank Transfer', 'Cash', 'Cheque', 'Card', 'Payment Gateways'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                        formData.paymentMethod === method
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-gray-900 border-gray-50 dark:border-gray-700 text-gray-400 hover:border-indigo-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attachment / Proof</label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={e => setFormData(prev => ({ ...prev, attachment: e.target.files?.[0] || null }))}
                  />
                  <div className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-4 transition-all group-hover:border-indigo-300 group-hover:bg-indigo-50/30">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Paperclip size={18} className="text-gray-400 group-hover:text-indigo-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 truncate">
                      {formData.attachment ? formData.attachment.name : 'Upload receipt or invoice...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Description</label>
              <textarea
                placeholder="Enter additional details about this transaction..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold min-h-[120px] resize-none"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-10 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-16 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2"
              >
                <Save size={18} />
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeneralLedger;

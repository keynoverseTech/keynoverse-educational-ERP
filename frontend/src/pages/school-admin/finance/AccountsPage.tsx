import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Save, X, Wallet } from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  type: 'Tuition' | 'Donation' | 'Other';
}

const AccountsPage: React.FC = () => {
  // Mock data - in a real app this would come from an API/Context
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'First Bank of Nigeria',
      accountName: 'Keynoverse University Tuition',
      accountNumber: '2034567890',
      isDefault: true,
      type: 'Tuition'
    },
    {
      id: '2',
      bankName: 'Zenith Bank',
      accountName: 'Keynoverse University Projects',
      accountNumber: '1012345678',
      isDefault: false,
      type: 'Other'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Partial<BankAccount>>({});

  const handleOpenCreate = () => {
    setCurrentAccount({ isDefault: false, type: 'Tuition' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: BankAccount) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account detail?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount.bankName || !currentAccount.accountNumber) return;

    if (currentAccount.id) {
      setAccounts(prev => prev.map(a => 
        a.id === currentAccount.id ? { ...a, ...currentAccount } as BankAccount : a
      ));
    } else {
      const newAccount: BankAccount = {
        id: `acc_${Date.now()}`,
        bankName: currentAccount.bankName,
        accountName: currentAccount.accountName || '',
        accountNumber: currentAccount.accountNumber,
        isDefault: Boolean(currentAccount.isDefault),
        type: currentAccount.type || 'Other'
      };
      
      // If setting as default, unset others
      if (newAccount.isDefault) {
        setAccounts(prev => prev.map(a => ({ ...a, isDefault: false })));
      }
      
      setAccounts(prev => [...prev, newAccount]);
    }
    setIsModalOpen(false);
  };

  const getTypeStyle = (type: BankAccount['type']) => {
    switch (type) {
      case 'Tuition': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Donation': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            School Bank Accounts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Configure bank details for receiving tuition and other payments.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25"
        >
          <Plus size={18} />
          Add Bank Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${
              account.isDefault ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getTypeStyle(account.type)}`}>
                  {account.type}
                </span>
                {account.isDefault && (
                  <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-green-50 text-green-600 border-green-100">
                    Default
                  </span>
                )}
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3 truncate max-w-[200px]" title={account.bankName}>
                  {account.bankName}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight truncate max-w-[200px]" title={account.accountName}>
                  {account.accountName}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Wallet size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                <p className="text-2xl font-mono font-black text-gray-900 dark:text-white tracking-wider">
                  {account.accountNumber}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenEdit(account)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(account.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-[10px] font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {currentAccount.id ? 'Edit Account' : 'Add Bank Account'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl shadow-sm transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bank Name</label>
                <input 
                  type="text" 
                  value={currentAccount.bankName || ''}
                  onChange={e => setCurrentAccount({...currentAccount, bankName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. GTBank"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Name</label>
                <input 
                  type="text" 
                  value={currentAccount.accountName || ''}
                  onChange={e => setCurrentAccount({...currentAccount, accountName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. University Tuition Collection"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Number</label>
                <input 
                  type="text" 
                  value={currentAccount.accountNumber || ''}
                  onChange={e => setCurrentAccount({...currentAccount, accountNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-gray-900 dark:text-white"
                  placeholder="e.g. 0123456789"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Type</label>
                <select
                  value={currentAccount.type || 'Other'}
                  onChange={e => setCurrentAccount({...currentAccount, type: e.target.value as BankAccount['type']})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                >
                  <option value="Tuition">Tuition Collection</option>
                  <option value="Donation">Donations & Grants</option>
                  <option value="Other">Other/General</option>
                </select>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={currentAccount.isDefault || false}
                      onChange={e => setCurrentAccount({...currentAccount, isDefault: e.target.checked})}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Set as Default</span>
                    <span className="block text-xs text-gray-500">Primary account for invoices</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;

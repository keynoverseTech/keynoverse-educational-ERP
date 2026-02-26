import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Save, X, CreditCard } from 'lucide-react';

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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            School Bank Accounts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure bank details for receiving tuition and other payments.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={16} />
          Add Bank Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative group hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <CreditCard size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(account)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(account.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={account.bankName}>
                  {account.bankName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate" title={account.accountName}>
                  {account.accountName}
                </p>
              </div>
              
              <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Number</p>
                <p className="text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                  {account.accountNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                  {account.type}
                </span>
                {account.isDefault && (
                  <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                    Default
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentAccount.id ? 'Edit Account' : 'Add Bank Account'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={currentAccount.bankName || ''}
                  onChange={e => setCurrentAccount({...currentAccount, bankName: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. GTBank"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
                <input 
                  type="text" 
                  value={currentAccount.accountName || ''}
                  onChange={e => setCurrentAccount({...currentAccount, accountName: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. University Tuition Collection"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                <input 
                  type="text" 
                  value={currentAccount.accountNumber || ''}
                  onChange={e => setCurrentAccount({...currentAccount, accountNumber: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="e.g. 0123456789"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                <select
                  value={currentAccount.type || 'Other'}
                  onChange={e => setCurrentAccount({...currentAccount, type: e.target.value as any})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Tuition">Tuition Collection</option>
                  <option value="Donation">Donations & Grants</option>
                  <option value="Other">Other/General</option>
                </select>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentAccount.isDefault || false}
                    onChange={e => setCurrentAccount({...currentAccount, isDefault: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Set as Default</span>
                    <span className="block text-xs text-gray-500">Primary account for invoices</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Save size={16} className="inline mr-2" />
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

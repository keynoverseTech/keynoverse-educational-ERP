import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Eye, Printer, X } from 'lucide-react';
import { useFinance, type Invoice } from '../../../../state/financeContext';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, setInvoices, feeStructures } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Unpaid' | 'Partially Paid' | 'Paid'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newStudentId, setNewStudentId] = useState('');
  const [newSession, setNewSession] = useState('2024/2025');
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.studentId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.session.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Partially Paid': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Unpaid': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const toggleFee = (feeId: string) => {
    setSelectedFeeIds(prev => prev.includes(feeId) ? prev.filter(id => id !== feeId) : [...prev, feeId]);
  };

  const handleOpenCreate = () => {
    setNewStudentId('');
    setNewSession('2024/2025');
    setSelectedFeeIds([]);
    setIsModalOpen(true);
  };

  const handleCreateInvoice = () => {
    if (!newStudentId.trim() || selectedFeeIds.length === 0) return;

    const items = selectedFeeIds
      .map(feeId => feeStructures.find(f => f.id === feeId))
      .filter((fee): fee is NonNullable<typeof fee> => Boolean(fee))
      .map(fee => ({
        feeStructureId: fee.id,
        amount: fee.amount,
        description: fee.name
      }));

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const newInvoice: Invoice = {
      id: `inv_${crypto.randomUUID().slice(0, 8)}`,
      studentId: newStudentId.trim(),
      session: newSession,
      items,
      totalAmount,
      status: 'Unpaid',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Student Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Generate and manage fee invoices for students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25"
          >
            <Plus size={18} />
            New Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search invoice, student ID, or session..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Unpaid', 'Partially Paid', 'Paid'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterStatus === status 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map(invoice => (
          <div key={invoice.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${
                invoice.status === 'Paid' ? 'bg-emerald-500' : invoice.status === 'Unpaid' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusStyle(invoice.status)}`}>
                  {invoice.status}
                </span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mt-3">{invoice.studentId}</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">{invoice.id} • {invoice.session}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <FileText size={20} className="text-gray-400" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 font-bold">Total Amount</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">₦{invoice.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 font-bold">Created</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              <button 
                onClick={() => navigate(`/school-admin/finance/student-accounting/invoices/${invoice.id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
              >
                <Eye size={14} /> View
              </button>
              <button 
                onClick={() => navigate(`/school-admin/finance/student-accounting/invoices/${invoice.id}`)}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"
                title="Print Invoice"
              >
                <Printer size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredInvoices.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <Search size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Invoices Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create New Invoice</h2>
                <p className="text-sm text-gray-500 mt-1">Select fees and generate an invoice.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl shadow-sm transition-all"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Student ID</label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                    placeholder="e.g. std_123"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Session</label>
                  <select
                    value={newSession}
                    onChange={(e) => setNewSession(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Fee Items</p>
                <div className="max-h-72 overflow-y-auto rounded-3xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {feeStructures.map(fee => {
                    const checked = selectedFeeIds.includes(fee.id);
                    return (
                      <label key={fee.id} className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFee(fee.id)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-black text-gray-900 dark:text-white text-sm">{fee.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tight">{fee.session}</p>
                          </div>
                        </div>
                        <p className="font-black text-gray-900 dark:text-white">₦{fee.amount.toLocaleString()}</p>
                      </label>
                    );
                  })}
                  {feeStructures.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">No fee structures found.</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Items</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{selectedFeeIds.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    ₦{selectedFeeIds
                      .map(id => feeStructures.find(f => f.id === id))
                      .filter((fee): fee is NonNullable<typeof fee> => Boolean(fee))
                      .reduce((sum, fee) => sum + fee.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-black border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateInvoice}
                  disabled={!newStudentId.trim() || selectedFeeIds.length === 0}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;

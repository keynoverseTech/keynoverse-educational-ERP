import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Printer } from 'lucide-react';
import { useFinance, type Invoice } from '../../../../state/financeContext';
// import { useHR } from '../../../state/hrAccessControl';

const InvoicesPage: React.FC = () => {
  const { invoices, setInvoices, feeStructures } = useFinance();
  // const { hasPermission } = useHR();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    if (!selectedStudent || selectedFees.length === 0) return;

    const items = selectedFees.map(feeId => {
      const fee = feeStructures.find(f => f.id === feeId);
      return {
        feeStructureId: feeId,
        amount: fee?.amount || 0,
        description: fee?.name || 'Unknown Fee'
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      studentId: selectedStudent,
      session: '2024/2025',
      items,
      totalAmount,
      status: 'Unpaid',
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setIsModalOpen(false);
    setSelectedStudent('');
    setSelectedFees([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Partially Paid': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Student Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage fee invoices for students
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search invoice or student ID..." 
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
            New Invoice
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice ID</th>
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium">Session</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{inv.id}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{inv.studentId}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.session}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₦{inv.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No invoices found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg animate-scale-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Invoice</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
                <input 
                  type="text" 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. STD/2024/001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Fees</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  {feeStructures.map(fee => (
                    <label key={fee.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedFees.includes(fee.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedFees([...selectedFees, fee.id]);
                          else setSelectedFees(selectedFees.filter(id => id !== fee.id));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 flex justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{fee.name}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">₦{fee.amount.toLocaleString()}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₦{selectedFees.reduce((sum, id) => sum + (feeStructures.find(f => f.id === id)?.amount || 0), 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateInvoice}
                  disabled={!selectedStudent || selectedFees.length === 0}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Invoice
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

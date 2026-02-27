import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Search, Eye, AlertCircle, Download } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

const ReceiptsPage: React.FC = () => {
  const navigate = useNavigate();
  const { myReceipts } = useStudentPortalFinance();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return myReceipts;
    return myReceipts.filter((r) => r.id.toLowerCase().includes(q) || r.invoiceId.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q));
  }, [myReceipts, searchTerm]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            Receipts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your payment receipts are available here.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search receipt, invoice, or reference..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <div key={r.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full bg-indigo-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100">
                    Successful
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">₦{r.amount.toLocaleString()}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">{r.reference}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <Receipt size={20} className="text-gray-400" />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Invoice</span>
                  <span className="font-mono text-indigo-600">{r.invoiceId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Method</span>
                  <span className="font-black text-gray-900 dark:text-white">{r.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Issued</span>
                  <span className="font-bold text-gray-600 dark:text-gray-300">{new Date(r.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/student/fees/receipts/${r.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => navigate(`/student/fees/receipts/${r.id}`)}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Receipts</h3>
            <p className="text-sm text-gray-500">Your receipts will appear here after successful payment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptsPage;


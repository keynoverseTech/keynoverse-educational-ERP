import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Download, Printer, Receipt } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

const ReceiptDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { receiptId } = useParams<{ receiptId: string }>();
  const { getReceiptById, getInvoiceById, student } = useStudentPortalFinance();

  const id = receiptId || '';
  const receipt = getReceiptById(id);
  const invoice = receipt ? getInvoiceById(receipt.invoiceId) : undefined;

  if (!receipt) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
            <Receipt size={40} />
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Receipt not found</h2>
          <p className="text-sm text-gray-500 mb-6">This receipt may have expired or is unavailable.</p>
          <button
            onClick={() => navigate('/student/fees/receipts')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
          >
            Back to Receipts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-xs font-black"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/25 text-xs font-black"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Keynoverse University</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Payment Receipt</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">
                Successful
              </span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-3">RECEIPT</h2>
              <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">{receipt.id}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Student</p>
            <p className="text-lg font-black text-gray-900 dark:text-white">{student.fullName}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">{receipt.studentId}</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoice</p>
            <p className="text-sm font-black text-gray-900 dark:text-white font-mono">{receipt.invoiceId}</p>
            {invoice && <p className="text-xs text-gray-500 mt-1">{invoice.session}</p>}
          </div>
          <div className="p-6 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20 text-white">
            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Amount Paid</p>
            <p className="text-2xl font-black">₦{receipt.amount.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-500/20 text-white">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Method</p>
            <p className="text-2xl font-black">{receipt.paymentMethod}</p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Field</th>
                  <th className="px-6 py-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                <tr className="text-sm">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Reference</td>
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">{receipt.reference}</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Issued</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(receipt.issuedAt).toLocaleString()}</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Payment ID</td>
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">{receipt.paymentId}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailsPage;


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Download, Mail, Building2 } from 'lucide-react';
import { useFinance } from '../../../../state/financeContext';

const InvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices } = useFinance();
  
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
            <Building2 size={40} />
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Invoice not found</h2>
          <p className="text-sm text-gray-500 mb-6">The invoice you’re looking for does not exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Partially Paid': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Invoices
        </button>
        <div className="flex flex-wrap gap-3 justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-xs font-black">
            <Mail size={14} />
            Email
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-xs font-black">
            <Download size={14} />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25 text-xs font-black"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Keynoverse University</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Excellence in Education</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-3">INVOICE</h2>
              <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tight">#{invoice.id}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billed To</p>
            <p className="text-lg font-black text-gray-900 dark:text-white">{invoice.studentId}</p>
            <p className="text-xs text-gray-500 mt-1">Computer Science Dept</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date Issued</p>
            <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session</p>
            <p className="text-sm font-black text-gray-900 dark:text-white">{invoice.session}</p>
          </div>
          <div className="p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 text-white">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Total Due</p>
            <p className="text-2xl font-black">₦{invoice.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{item.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">
                      ₦{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <tr className="text-sm">
                  <td className="px-6 py-4 text-right font-black text-gray-400 uppercase tracking-widest">Subtotal</td>
                  <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">₦{invoice.totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2 text-right font-black text-gray-400 uppercase tracking-widest">Tax</td>
                  <td className="px-6 py-2 text-right font-black text-gray-900 dark:text-white">₦0.00</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Due</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">₦{invoice.totalAmount.toLocaleString()}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Instructions</p>
          <p className="font-bold text-gray-900 dark:text-white mb-2">Please make payment to the following account:</p>
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl inline-block shadow-sm">
            <p className="text-sm"><span className="font-black text-gray-900 dark:text-white">Bank:</span> First Bank of Nigeria</p>
            <p className="text-sm mt-1"><span className="font-black text-gray-900 dark:text-white">Account Name:</span> Keynoverse University Tuition</p>
            <p className="text-sm mt-1"><span className="font-black text-gray-900 dark:text-white">Account No:</span> 2034567890</p>
          </div>
          <p className="mt-6 text-[10px] text-gray-400 font-mono uppercase tracking-tight">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;

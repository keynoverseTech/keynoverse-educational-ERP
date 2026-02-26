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
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-700">Invoice not found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Partially Paid': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Invoices
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            <Mail size={16} />
            Email
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            <Download size={16} />
            Download PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Printer size={16} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Keynoverse University</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Excellence in Education</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">INVOICE</h2>
              <p className="font-mono text-blue-600 dark:text-blue-400 font-medium">#{invoice.id}</p>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Billed To</p>
            <p className="font-bold text-gray-900 dark:text-white text-base">{invoice.studentId}</p>
            <p className="text-gray-500 dark:text-gray-400">Computer Science Dept</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Date Issued</p>
            <p className="font-medium text-gray-900 dark:text-white">{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Session</p>
            <p className="font-medium text-gray-900 dark:text-white">{invoice.session}</p>
          </div>
          <div>
             <p className="text-gray-500 dark:text-gray-400 mb-1">Status</p>
             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
               {invoice.status}
             </span>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-8 pb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Description</th>
                <th className="px-4 py-3 font-medium text-right rounded-r-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-gray-900 dark:text-white font-medium">
                    {item.description}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white">
                    ₦{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200 dark:border-gray-700">
              <tr>
                <td className="px-4 py-4 text-right font-medium text-gray-500 dark:text-gray-400">Subtotal</td>
                <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">
                  ₦{invoice.totalAmount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Tax (0%)</td>
                <td className="px-4 py-2 text-right font-bold text-gray-900 dark:text-white">
                  ₦0.00
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total Due</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₦{invoice.totalAmount.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-medium text-gray-900 dark:text-white mb-2">Payment Instructions:</p>
          <p>Please make payment to the following account:</p>
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg inline-block">
             <p><span className="font-medium">Bank:</span> First Bank of Nigeria</p>
             <p><span className="font-medium">Account Name:</span> Keynoverse University Tuition</p>
             <p><span className="font-medium">Account No:</span> 2034567890</p>
          </div>
          <p className="mt-4 text-xs">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;

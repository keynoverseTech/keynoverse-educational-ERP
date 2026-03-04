import React from 'react';
import { DollarSign } from 'lucide-react';
import type { PayrollSummaryData } from './types';

interface PayrollWidgetProps {
  data: PayrollSummaryData;
}

const PayrollWidget: React.FC<PayrollWidgetProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="p-2 bg-white/20 rounded-lg">
          <DollarSign size={24} />
        </div>
        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Monthly</span>
      </div>
      <p className="text-indigo-100 text-sm font-medium mb-1">Total Payroll (Est.)</p>
      <h3 className="text-3xl font-bold mb-4">${data.totalPayroll.toLocaleString()}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm border-t border-white/10 pt-3">
          <span className="text-indigo-100">Last Month</span>
          <span className="font-bold">${data.lastMonthTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-white/10 pt-3">
          <span className="text-indigo-100">Pending</span>
          <span className="font-bold text-yellow-300">${data.pendingDisbursements.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-white/10 pt-3">
          <span className="text-indigo-100">Next Pay Date</span>
          <span className="font-bold">{new Date(data.nextPayDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollWidget;

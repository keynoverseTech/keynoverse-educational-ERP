import React from 'react';
import { DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';
import type { PayrollSummaryData } from './types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PayrollSummaryProps {
  data: PayrollSummaryData;
}

const PayrollSummary: React.FC<PayrollSummaryProps> = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Payroll Expenses',
        data: [1150000, 1180000, 1200000, 1245000, 1250000, 1250000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Current Payroll</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${data.totalPayroll.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp size={14} className="mr-1" />
            +0.4% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Pending Disbursements</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${data.pendingDisbursements.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Due by {new Date(data.nextPayDate).toLocaleDateString()}</p>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Avg. Salary</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$5,102</p>
          <p className="text-xs text-gray-500 mt-2">Per employee</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payroll History</h3>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Download size={16} />
            Export Report
          </button>
        </div>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;

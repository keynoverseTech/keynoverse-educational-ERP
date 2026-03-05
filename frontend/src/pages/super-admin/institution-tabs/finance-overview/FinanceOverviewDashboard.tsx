import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Users, Briefcase } from 'lucide-react';
import { financeOverviewService } from './service.ts';
import type { FinanceOverviewData } from './types.ts';
import StudentFinanceSummary from './StudentFinanceSummary.tsx';
import AdminFinanceSummary from './AdminFinanceSummary.tsx';

const FinanceOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<FinanceOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('student');

  useEffect(() => {
    financeOverviewService.getFinanceOverviewData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign size={24} className="text-green-500" />
            Finance Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">A high-level summary of the institution's financial health.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'student'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Users size={16} />
          Student Accounting
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'admin'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Briefcase size={16} />
          Administrative Accounting
        </button>
      </div>

      {activeTab === 'student' && <StudentFinanceSummary data={data.studentFinance} />}
      {activeTab === 'admin' && <AdminFinanceSummary data={data.adminFinance} />}
    </div>
  );
};

export default FinanceOverviewDashboard;

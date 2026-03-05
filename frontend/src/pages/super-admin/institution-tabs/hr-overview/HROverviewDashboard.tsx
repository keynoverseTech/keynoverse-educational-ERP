import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Calendar, 
  ArrowUpRight,
  PieChart,
  Layout,
  ArrowLeft
} from 'lucide-react';
import { hrOverviewService } from './service';
import type { HROverviewData } from './types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import StaffList from './StaffList';
import PayrollSummary from './PayrollSummary';
import PayrollWidget from './PayrollWidget';
import LeaveRequests from './LeaveRequests';

ChartJS.register(ArcElement, Tooltip, Legend);

const HROverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<HROverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'payroll' | 'leave'>('overview');

  useEffect(() => {
    hrOverviewService.getHROverviewData().then(res => {
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

  const chartData = {
    labels: data.departmentDistribution.map(d => d.name),
    datasets: [
      {
        data: data.departmentDistribution.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffList staff={data.recentStaff} />;
      case 'payroll':
        return <PayrollSummary data={data.payroll} />;
      case 'leave':
        return <LeaveRequests requests={data.recentLeaveRequests} />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PieChart size={20} className="text-purple-500" />
                    Department Distribution
                  </h3>
                </div>
                <div className="h-64 flex justify-center">
                  <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                </div>
              </div>
              <StaffList staff={data.recentStaff.slice(0, 5)} />
            </div>
            <div className="space-y-6">
              <PayrollWidget data={data.payroll} />
              <LeaveRequests requests={data.recentLeaveRequests} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Human Resources Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage staff, payroll, and leave requests</p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#151e32] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.trendUp ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={20} /> : <Activity size={20} />}
              </div>
            </div>
            {stat.trend && (
              <div className="mt-2 flex items-center text-xs">
                <span className={stat.trendUp ? 'text-green-600' : 'text-gray-500'}>{stat.trend}</span>
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Layout },
          { id: 'staff', label: 'Staff Directory', icon: Users },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default HROverviewDashboard;

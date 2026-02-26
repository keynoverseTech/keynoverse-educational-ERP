import React from 'react';
import { DollarSign, Settings, Users, ArrowRight } from 'lucide-react';

const PayrollScaffold: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-blue-600" />
          Payroll Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage staff salaries, allowances, and monthly payroll runs (Phase 2)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Salary Structure */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit mb-4">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Salary Structures</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
            Define base salaries, allowances, and deductions for different grade levels.
          </p>
          <div className="flex items-center text-sm font-medium text-blue-600">
            Configure <ArrowRight size={16} className="ml-1" />
          </div>
        </div>

        {/* Module 2: Staff Assignment */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-fit mb-4">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600">Staff Assignment</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
            Assign salary structures to individual staff members or departments.
          </p>
          <div className="flex items-center text-sm font-medium text-purple-600">
            Manage Assignments <ArrowRight size={16} className="ml-1" />
          </div>
        </div>

        {/* Module 3: Payroll Run */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit mb-4">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600">Run Payroll</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
            Generate monthly payroll, review slips, and approve for payment.
          </p>
          <div className="flex items-center text-sm font-medium text-green-600">
            Process Payroll <ArrowRight size={16} className="ml-1" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
          <Settings size={16} className="text-yellow-700 dark:text-yellow-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Phase 2 Under Construction</h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            The Payroll Engine is currently being architected. Full functionality will be available in the next release.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayrollScaffold;

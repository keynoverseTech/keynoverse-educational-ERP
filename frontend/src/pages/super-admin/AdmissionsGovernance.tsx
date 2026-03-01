import React from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

const AdmissionsGovernance: React.FC = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admissions Governance</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage global admission policies and oversight.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-6">
          <Shield size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Governance Module Under Development</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          This module will provide tools for auditing admission processes, setting global intake limits, and enforcing compliance across all institutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white">
              <Lock size={16} className="text-amber-500" />
              <span>Policy Enforcement</span>
            </div>
            <p className="text-xs text-gray-500">Set mandatory admission criteria and documentation requirements.</p>
          </div>
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white">
              <AlertTriangle size={16} className="text-amber-500" />
              <span>Fraud Detection</span>
            </div>
            <p className="text-xs text-gray-500">Automated flagging of suspicious applications and duplicate identities.</p>
          </div>
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white">
              <Shield size={16} className="text-amber-500" />
              <span>Audit Trails</span>
            </div>
            <p className="text-xs text-gray-500">Comprehensive logs of all admission decisions and overrides.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsGovernance;

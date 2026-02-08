import React, { useState } from 'react';
import ReportFilter, { type FilterState } from './ReportFilter';
import { Download, FileText, Printer } from 'lucide-react';

const AcademicReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gpa');

  const tabs = [
    { id: 'gpa', label: 'GPA Performance' },
    { id: 'failed', label: 'Failed Courses Report' },
    { id: 'probation', label: 'Probation List' },
    { id: 'graduation', label: 'Graduation Eligibility' },
  ];

  const handleGenerate = (filters: FilterState) => {
    console.log('Generating report with filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ReportFilter onGenerate={handleGenerate} />

      <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-center text-gray-500">
             <p className="mb-2">Select filters and click "Generate Report" to view data</p>
             <p className="text-sm text-gray-400">Showing sample layout for {activeTab}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicReports;
import React, { useState } from 'react';
import ReportsFilter, { type FilterState } from './ReportsFilter';
import GlobalReports from './GlobalReports';
import InstitutionReports from './InstitutionReports';

const ReportsLayout: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    institution: 'all',
    reportType: 'summary',
    startDate: '',
    endDate: ''
  });

  const handleGenerateReport = (filters: FilterState) => {
    console.log('Generating report with filters:', filters);
    setActiveFilters(filters);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 bg-gray-50 dark:bg-[#0f172a] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate insights and track performance across institutions.
          </p>
        </div>
      </div>

      <ReportsFilter onGenerate={handleGenerateReport} />

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        {activeFilters.institution === 'all' ? (
          <GlobalReports filters={activeFilters} />
        ) : (
          <InstitutionReports 
            institutionId={activeFilters.institution} 
            reportType={activeFilters.reportType}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsLayout;

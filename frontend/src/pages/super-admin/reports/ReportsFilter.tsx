import React, { useState } from 'react';
import { Filter, Search, Building2, Calendar, FileBarChart } from 'lucide-react';

export interface FilterState {
  institution: string;
  reportType: string;
  startDate: string;
  endDate: string;
}

interface ReportsFilterProps {
  onGenerate: (filters: FilterState) => void;
}

const ReportsFilter: React.FC<ReportsFilterProps> = ({ onGenerate }) => {
  const [filters, setFilters] = useState<FilterState>({
    institution: 'all',
    reportType: 'summary',
    startDate: '',
    endDate: ''
  });

  const institutions = [
    { id: 'all', name: 'All Institutions (Global)' },
    { id: 'inst-1', name: 'Global Heights Academy' },
    { id: 'inst-2', name: 'Tech Institute of Technology' },
    { id: 'inst-3', name: 'City University' },
  ];

  const reportTypes = [
    { id: 'summary', name: 'Executive Summary' },
    { id: 'academic', name: 'Academic Reports' },
    { id: 'admission', name: 'Admission Reports' },
    { id: 'examination', name: 'Examination Reports' },
    { id: 'financial', name: 'Finance Reports' },
    { id: 'student', name: 'Student Reports' },
  ];

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        <Filter className="w-4 h-4" />
        <span>Report Configuration</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Institution Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
            <Building2 size={14} />
            Target Institution
          </label>
          <div className="relative">
            <select
              value={filters.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer transition-all hover:border-blue-400"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Building2 size={14} />
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
            <FileBarChart size={14} />
            Report Type
          </label>
          <div className="relative">
            <select
              value={filters.reportType}
              onChange={(e) => handleChange('reportType', e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer transition-all hover:border-blue-400"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <FileBarChart size={14} />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} />
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all hover:border-blue-400"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} />
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all hover:border-blue-400"
            />
          </div>
          
          <button
            onClick={() => onGenerate(filters)}
            className="h-[42px] px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
          >
            <Search size={16} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilter;

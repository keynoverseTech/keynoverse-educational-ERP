import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export interface FilterState {
  session: string;
  semester: string;
  faculty: string;
  department: string;
  level: string;
  programme: string;
}

interface ReportFilterProps {
  onGenerate: (filters: FilterState) => void;
  showSession?: boolean;
  showSemester?: boolean;
  showFaculty?: boolean;
  showDepartment?: boolean;
  showLevel?: boolean;
  showProgramme?: boolean;
}

const ReportFilter: React.FC<ReportFilterProps> = ({
  onGenerate,
  showSession = true,
  showSemester = true,
  showFaculty = true,
  showDepartment = true,
  showLevel = true,
  showProgramme = false,
}) => {
  const [filters, setFilters] = useState({
    session: '2024/2025',
    semester: 'First',
    faculty: '',
    department: '',
    level: '',
    programme: ''
  });

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        <Filter className="w-4 h-4" />
        <span>Report Configuration</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {showSession && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.session}
              onChange={(e) => handleChange('session', e.target.value)}
            >
              <option>2024/2025</option>
              <option>2023/2024</option>
              <option>2022/2023</option>
            </select>
          </div>
        )}

        {showSemester && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Semester</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
            >
              <option>First</option>
              <option>Second</option>
            </select>
          </div>
        )}

        {showFaculty && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Faculty</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.faculty}
              onChange={(e) => handleChange('faculty', e.target.value)}
            >
              <option value="">All Faculties</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        )}

        {showDepartment && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        )}

        {showLevel && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.level}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
            </select>
          </div>
        )}

        {showProgramme && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Programme</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.programme}
              onChange={(e) => handleChange('programme', e.target.value)}
            >
              <option value="">All Programmes</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button 
            onClick={() => onGenerate(filters)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
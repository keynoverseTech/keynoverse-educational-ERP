import React, { useState } from 'react';
import { Search, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ExamSummary } from './types.ts';

interface ExamTimeTableProps {
  exams: ExamSummary[];
}

const ExamTimeTable: React.FC<ExamTimeTableProps> = ({ exams }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Derive unique faculties and departments for filters
  const faculties = Array.from(new Set(exams.map(e => e.faculty))).sort();
  const departments = Array.from(new Set(
    facultyFilter === 'All' 
      ? exams.map(e => e.department) 
      : exams.filter(e => e.faculty === facultyFilter).map(e => e.department)
  )).sort();

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesFaculty = facultyFilter === 'All' || e.faculty === facultyFilter;
    const matchesDepartment = departmentFilter === 'All' || e.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesFaculty && matchesDepartment;
  });

  return (
    <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Exam Timetable</h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Status</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Faculty</span>
            <select 
              value={facultyFilter}
              onChange={(e) => {
                setFacultyFilter(e.target.value);
                setDepartmentFilter('All'); // Reset department when faculty changes
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="All">All Faculties</option>
              {faculties.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Department</span>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Exam Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Course</th>
              <th className="px-6 py-3 font-medium text-gray-500 hidden lg:table-cell">Faculty / Dept</th>
              <th className="px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 font-medium text-gray-500">Time</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {exam.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{exam.name}</div>
                      <div className="text-xs text-gray-400">ID: {exam.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{exam.course}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{exam.faculty}</div>
                  <div className="text-[10px] text-gray-400">{exam.department}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(exam.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{exam.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    exam.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => navigate('/super-admin/assesment-and-result/exam-details', { state: { exam: exam } })}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExams.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No exams found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTimeTable;

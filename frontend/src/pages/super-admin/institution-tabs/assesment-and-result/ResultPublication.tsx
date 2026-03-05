import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Search, Calendar } from 'lucide-react';
import type { ResultSummary } from './types.ts';

interface ResultPublicationProps {
  results: ResultSummary[];
}

const ResultPublication: React.FC<ResultPublicationProps> = ({ results }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Derive unique faculties and departments for filters
  const faculties = Array.from(new Set(results.map(r => r.faculty))).sort();
  const departments = Array.from(new Set(
    facultyFilter === 'All' 
      ? results.map(r => r.department) 
      : results.filter(r => r.faculty === facultyFilter).map(r => r.department)
  )).sort();

  const filteredResults = results.filter(r => {
    const matchesSearch = r.examName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesFaculty = facultyFilter === 'All' || r.faculty === facultyFilter;
    const matchesDepartment = departmentFilter === 'All' || r.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesFaculty && matchesDepartment;
  });

  return (
    <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Result Publications</h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search results..." 
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
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Withheld">Withheld</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Faculty</span>
            <select 
              value={facultyFilter}
              onChange={(e) => {
                setFacultyFilter(e.target.value);
                setDepartmentFilter('All');
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
              <th className="px-6 py-3 font-medium text-gray-500">Publication Date</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredResults.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{res.examName}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{res.course}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{res.faculty}</div>
                  <div className="text-[10px] text-gray-400">{res.department}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(res.publicationDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    res.status === 'Published' ? 'bg-green-100 text-green-700' :
                    res.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {res.status === 'Published' && <CheckCircle size={12} />}
                    {res.status === 'Pending' && <Clock size={12} />}
                    {res.status === 'Withheld' && <XCircle size={12} />}
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigate('/super-admin/assesment-and-result/result-details', { state: { result: res } })} className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResults.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No results found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPublication;

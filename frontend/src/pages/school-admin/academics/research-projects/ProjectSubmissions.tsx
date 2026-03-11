import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download,
  Eye
} from 'lucide-react';

const ProjectSubmissions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProgramme, setFilterProgramme] = useState('All');

  // Mock Filters
  const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];
  const departments = ['Computer Science', 'Architecture', 'Biology', 'Physics', 'Mathematics'];
  const programmes = ['HND Computer Science', 'HND Architecture', 'HND Biology'];

  // Mock Data
  const submissions = [
    {
      id: 1,
      student: 'John Doe',
      project: 'AI in Healthcare Diagnostics',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      stage: 'Chapter 3',
      version: 'v2.1',
      date: '2024-03-20',
      status: 'Pending Review',
      file: 'chapter3_v2.1.pdf'
    },
    {
      id: 2,
      student: 'Jane Smith',
      project: 'Sustainable Urban Planning',
      department: 'Architecture',
      faculty: 'Faculty of Environmental Sciences',
      programme: 'HND Architecture',
      stage: 'Final Draft',
      version: 'v1.0',
      date: '2024-03-19',
      status: 'Approved',
      file: 'final_thesis.pdf'
    },
    {
      id: 3,
      student: 'Michael Brown',
      project: 'Blockchain Voting',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      stage: 'Proposal',
      version: 'v1.2',
      date: '2024-03-18',
      status: 'Revision Required',
      file: 'proposal_updated.docx'
    }
  ];

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.project.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.student.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = filterFaculty === 'All' || sub.faculty === filterFaculty;
    const matchesDepartment = filterDepartment === 'All' || sub.department === filterDepartment;
    const matchesProgramme = filterProgramme === 'All' || sub.programme === filterProgramme;

    return matchesSearch && matchesFaculty && matchesDepartment && matchesProgramme;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-blue-600" />
            Project Submissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Track and review student project uploads.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search submissions..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Faculties</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Programmes</option>
            {programmes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student / Project</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 dark:text-white">{sub.student}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{sub.project}</p>
                  <div className="flex gap-1 mt-1">
                     <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{sub.programme}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sub.stage}</span>
                  <span className="text-xs text-gray-400 ml-2">({sub.version})</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {sub.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    sub.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    sub.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sub.status === 'Approved' ? <CheckCircle size={12} /> : 
                     sub.status === 'Pending Review' ? <Clock size={12} /> : 
                     <AlertCircle size={12} />}
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600" title="Review">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSubmissions;

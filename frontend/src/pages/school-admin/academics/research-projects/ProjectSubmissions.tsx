import React from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download,
  Eye
} from 'lucide-react';

const ProjectSubmissions: React.FC = () => {
  // Mock Data
  const submissions = [
    {
      id: 1,
      student: 'John Doe',
      project: 'AI in Healthcare Diagnostics',
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
      stage: 'Proposal',
      version: 'v1.2',
      date: '2024-03-18',
      status: 'Revision Required',
      file: 'proposal_updated.docx'
    }
  ];

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
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search submissions..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
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
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 dark:text-white">{sub.student}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{sub.project}</p>
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
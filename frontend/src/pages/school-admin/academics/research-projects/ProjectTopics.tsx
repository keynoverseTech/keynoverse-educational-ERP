import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye 
} from 'lucide-react';

const ProjectTopics: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const topics = [
    {
      id: 1,
      title: 'AI in Healthcare Diagnostics',
      student: 'John Doe',
      department: 'Computer Science',
      supervisor: 'Dr. Alan Smith',
      date: '2024-03-10',
      status: 'Pending',
      abstract: 'This research explores the use of machine learning algorithms to improve early diagnosis of chronic diseases.'
    },
    {
      id: 2,
      title: 'Sustainable Urban Planning',
      student: 'Jane Smith',
      department: 'Architecture',
      supervisor: 'Prof. Sarah Connor',
      date: '2024-03-08',
      status: 'Approved',
      abstract: 'Analyzing the impact of green spaces on urban heat islands and resident well-being.'
    },
    {
      id: 3,
      title: 'Blockchain for Voting Systems',
      student: 'Michael Brown',
      department: 'Computer Science',
      supervisor: 'Dr. Alan Smith',
      date: '2024-03-05',
      status: 'Rejected',
      abstract: 'A proposal for a decentralized, transparent voting system using Ethereum blockchain.'
    },
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesStatus = filterStatus === 'All' || topic.status === filterStatus;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.student.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Project Topics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Review and approve student research proposals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === status 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Topic Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Supervisor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTopics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs" title={topic.title}>{topic.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{topic.date}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {topic.student.charAt(0)}
                    </div>
                    {topic.student}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{topic.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{topic.supervisor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    topic.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    topic.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {topic.status === 'Approved' && <CheckCircle size={12} />}
                    {topic.status === 'Rejected' && <XCircle size={12} />}
                    {topic.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="View Details">
                      <Eye size={16} />
                    </button>
                    {topic.status === 'Pending' && (
                      <>
                        <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg" title="Reject">
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTopics.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No topics found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTopics;
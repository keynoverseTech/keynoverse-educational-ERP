import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  User, 
  Calendar, 
  Tag, 
  Download,
  X,
  AlertCircle
} from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  student: string;
  matricNumber: string;
  department: string;
  supervisor: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  researchArea: string;
  keywords: string[];
  abstract: string;
  documentUrl: string;
}

const ProjectTopics: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Mock Data
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 1,
      title: 'AI in Healthcare Diagnostics',
      student: 'John Doe',
      matricNumber: 'SCI/20/001',
      department: 'Computer Science',
      supervisor: 'Dr. Alan Smith',
      date: '2024-03-10',
      status: 'Pending',
      researchArea: 'Artificial Intelligence',
      keywords: ['Machine Learning', 'Healthcare', 'Diagnosis'],
      abstract: 'This research explores the use of machine learning algorithms to improve early diagnosis of chronic diseases. The study focuses on using CNNs to analyze medical imaging data for faster and more accurate detection of anomalies.',
      documentUrl: '#'
    },
    {
      id: 2,
      title: 'Sustainable Urban Planning',
      student: 'Jane Smith',
      matricNumber: 'ENV/20/045',
      department: 'Architecture',
      supervisor: 'Prof. Sarah Connor',
      date: '2024-03-08',
      status: 'Approved',
      researchArea: 'Urban Design',
      keywords: ['Sustainability', 'Urban Planning', 'Green Spaces'],
      abstract: 'Analyzing the impact of green spaces on urban heat islands and resident well-being. The project aims to propose a framework for integrating more vertical gardens in high-density areas.',
      documentUrl: '#'
    },
    {
      id: 3,
      title: 'Blockchain for Voting Systems',
      student: 'Michael Brown',
      matricNumber: 'SCI/20/022',
      department: 'Computer Science',
      supervisor: 'Dr. Alan Smith',
      date: '2024-03-05',
      status: 'Rejected',
      researchArea: 'Blockchain Technology',
      keywords: ['Blockchain', 'Voting', 'Security', 'Decentralization'],
      abstract: 'A proposal for a decentralized, transparent voting system using Ethereum blockchain. This project addresses the issues of voter fraud and lack of transparency in traditional electronic voting systems.',
      documentUrl: '#'
    },
  ]);

  const handleStatusChange = (id: number, newStatus: 'Approved' | 'Rejected') => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, status: newStatus } : topic
    ));
    if (selectedTopic && selectedTopic.id === id) {
      setSelectedTopic({ ...selectedTopic, status: newStatus });
    }
  };

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
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {topic.student.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{topic.student}</div>
                      <div className="text-xs text-gray-500">{topic.matricNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{topic.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{topic.supervisor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    topic.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    topic.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {topic.status === 'Approved' && <CheckCircle size={12} />}
                    {topic.status === 'Rejected' && <XCircle size={12} />}
                    {topic.status === 'Pending' && <AlertCircle size={12} />}
                    {topic.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedTopic(topic)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400" 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {topic.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(topic.id, 'Approved')}
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg" 
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(topic.id, 'Rejected')}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg" 
                          title="Reject"
                        >
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

      {/* Details Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Topic Proposal Details</h2>
              <button 
                onClick={() => setSelectedTopic(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <FileText size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedTopic.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {selectedTopic.student} ({selectedTopic.matricNumber})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {selectedTopic.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border ${
                selectedTopic.status === 'Approved' 
                  ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30' 
                  : selectedTopic.status === 'Rejected'
                  ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'
                  : 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedTopic.status === 'Approved' && <CheckCircle className="text-green-600 dark:text-green-400" size={20} />}
                    {selectedTopic.status === 'Rejected' && <XCircle className="text-red-600 dark:text-red-400" size={20} />}
                    {selectedTopic.status === 'Pending' && <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />}
                    <div>
                      <p className={`font-bold ${
                        selectedTopic.status === 'Approved' ? 'text-green-900 dark:text-green-100' :
                        selectedTopic.status === 'Rejected' ? 'text-red-900 dark:text-red-100' :
                        'text-amber-900 dark:text-amber-100'
                      }`}>Status: {selectedTopic.status}</p>
                    </div>
                  </div>
                  {selectedTopic.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(selectedTopic.id, 'Approved')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedTopic.id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Research Area</label>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{selectedTopic.researchArea}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Proposed Supervisor</label>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{selectedTopic.supervisor}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Abstract</label>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {selectedTopic.abstract}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Keywords</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTopic.keywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center gap-1">
                        <Tag size={12} /> {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Proposal Document</label>
                  <div className="mt-2 flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Project_Proposal.pdf</p>
                        <p className="text-xs text-gray-500">2.4 MB • Uploaded on {selectedTopic.date}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {selectedTopic.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedTopic.id, 'Rejected');
                      setSelectedTopic(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Reject Proposal
                  </button>
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedTopic.id, 'Approved');
                      setSelectedTopic(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve Proposal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTopics;

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
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  student: string;
  matricNumber: string;
  department: string;
  faculty: string;
  programme: string;
  supervisor: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  researchArea: string;
  keywords: string[];
  abstract: string;
  documentUrl: string;
}

interface ArchiveProject {
  id: number;
  title: string;
  student: string;
  year: string;
  department: string;
  faculty: string;
  programme: string;
  abstract: string;
  keywords: string[];
}

type SemanticCheckVerdict = 'none' | 'low' | 'moderate' | 'high';

interface SemanticMatch {
  projectId: number;
  title: string;
  year: string;
  department: string;
  programme: string;
  student: string;
  score: number;
}

interface SemanticCheckState {
  status: 'idle' | 'checking' | 'done';
  verdict: SemanticCheckVerdict;
  matches: SemanticMatch[];
  maxScore: number;
}

const ProjectTopics: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProgramme, setFilterProgramme] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [semanticCheck, setSemanticCheck] = useState<SemanticCheckState>({
    status: 'idle',
    verdict: 'none',
    matches: [],
    maxScore: 0
  });

  // Mock Filters
  const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];
  const departments = ['Computer Science', 'Architecture', 'Biology', 'Physics', 'Mathematics'];
  const programmes = ['HND Computer Science', 'HND Architecture', 'HND Biology'];

  // Mock Data
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 1,
      title: 'AI in Healthcare Diagnostics',
      student: 'John Doe',
      matricNumber: 'SCI/20/001',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
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
      faculty: 'Faculty of Environmental Sciences',
      programme: 'HND Architecture',
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
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      supervisor: 'Dr. Alan Smith',
      date: '2024-03-05',
      status: 'Rejected',
      researchArea: 'Blockchain Technology',
      keywords: ['Blockchain', 'Voting', 'Security', 'Decentralization'],
      abstract: 'A proposal for a decentralized, transparent voting system using Ethereum blockchain. This project addresses the issues of voter fraud and lack of transparency in traditional electronic voting systems.',
      documentUrl: '#'
    },
  ]);

  const archive: ArchiveProject[] = [
    {
      id: 1,
      title: 'Machine Learning in Agriculture',
      student: 'David Green',
      year: '2023',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      abstract: 'Optimizing crop yield using predictive analytics and IoT sensors.',
      keywords: ['ML', 'IoT', 'Agriculture'],
    },
    {
      id: 2,
      title: 'Renewable Energy Systems for Rural Areas',
      student: 'Emily White',
      year: '2022',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering',
      programme: 'B.Eng Electrical Engineering',
      abstract: 'Design and implementation of cost-effective solar-wind hybrid systems.',
      keywords: ['Solar', 'Wind', 'Rural Electrification'],
    },
    {
      id: 3,
      title: 'AI-Assisted Medical Imaging Diagnostics',
      student: 'Grace Peter',
      year: '2023',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      abstract: 'Using deep learning to detect anomalies in radiology images for faster clinical decision support.',
      keywords: ['AI', 'Deep Learning', 'Healthcare', 'Diagnosis'],
    },
    {
      id: 4,
      title: 'Blockchain-Based Secure E-Voting',
      student: 'Michael Okon',
      year: '2022',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      abstract: 'A decentralized voting framework leveraging blockchain immutability and cryptographic verification.',
      keywords: ['Blockchain', 'Voting', 'Security', 'Decentralization'],
    },
  ];

  const tokenize = (text: string) =>
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((t) => t.length >= 3);

  const jaccard = (a: string[], b: string[]) => {
    const aSet = new Set(a);
    const bSet = new Set(b);
    if (aSet.size === 0 && bSet.size === 0) return 0;
    let intersection = 0;
    for (const token of aSet) {
      if (bSet.has(token)) intersection += 1;
    }
    const union = aSet.size + bSet.size - intersection;
    return union === 0 ? 0 : intersection / union;
  };

  const getVerdictFromScore = (score: number): SemanticCheckVerdict => {
    if (score <= 0) return 'none';
    if (score >= 70) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  };

  const runSemanticSimilarityCheck = async (topic: Topic) => {
    setSemanticCheck({
      status: 'checking',
      verdict: 'none',
      matches: [],
      maxScore: 0
    });

    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 1400);
    });

    const titleTokens = tokenize(topic.title);
    const abstractTokens = tokenize(topic.abstract);
    const keywordTokens = topic.keywords.map((k) => k.toLowerCase());

    const matches: SemanticMatch[] = archive
      .map((p) => {
        const pTitleTokens = tokenize(p.title);
        const pAbstractTokens = tokenize(p.abstract);
        const pKeywordTokens = p.keywords.map((k) => k.toLowerCase());

        const titleSim = jaccard(titleTokens, pTitleTokens);
        const keywordSim = jaccard(keywordTokens, pKeywordTokens);
        const abstractSim = jaccard(abstractTokens, pAbstractTokens);

        const score = Math.round((titleSim * 0.6 + keywordSim * 0.3 + abstractSim * 0.1) * 100);

        return {
          projectId: p.id,
          title: p.title,
          year: p.year,
          department: p.department,
          programme: p.programme,
          student: p.student,
          score
        };
      })
      .filter((m) => m.score >= 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const maxScore = matches.length ? matches[0].score : 0;
    const verdict = getVerdictFromScore(maxScore);

    setSemanticCheck({
      status: 'done',
      verdict,
      matches,
      maxScore
    });
  };

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
    const matchesFaculty = filterFaculty === 'All' || topic.faculty === filterFaculty;
    const matchesDepartment = filterDepartment === 'All' || topic.department === filterDepartment;
    const matchesProgramme = filterProgramme === 'All' || topic.programme === filterProgramme;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.student.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch && matchesFaculty && matchesDepartment && matchesProgramme;
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
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
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
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
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
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{topic.programme}</span>
                    <span className="text-xs">{topic.department}</span>
                    <span className="text-[10px] text-gray-400">{topic.faculty}</span>
                  </div>
                </td>
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
                      onClick={() => {
                        setSelectedTopic(topic);
                        setSemanticCheck({
                          status: 'idle',
                          verdict: 'none',
                          matches: [],
                          maxScore: 0
                        });
                      }}
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
                {selectedTopic.status === 'Pending' && (
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Semantic Similarity</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Check this topic against the Project Archive for similar or existing projects.
                        </p>
                      </div>
                      <button
                        onClick={() => runSemanticSimilarityCheck(selectedTopic)}
                        disabled={semanticCheck.status === 'checking'}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                          semanticCheck.status === 'checking'
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {semanticCheck.status === 'checking' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search size={16} />
                            Check Similarity
                          </>
                        )}
                      </button>
                    </div>

                    {semanticCheck.status === 'done' && (
                      <div className="mt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                semanticCheck.verdict === 'high'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : semanticCheck.verdict === 'moderate'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : semanticCheck.verdict === 'low'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {semanticCheck.verdict === 'high'
                                ? 'High similarity'
                                : semanticCheck.verdict === 'moderate'
                                ? 'Moderate similarity'
                                : semanticCheck.verdict === 'low'
                                ? 'Low similarity'
                                : 'No similarity'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Top match: {semanticCheck.maxScore ? `${semanticCheck.maxScore}%` : 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {semanticCheck.verdict === 'high'
                              ? 'Recommendation: Reject or request a different topic.'
                              : semanticCheck.verdict === 'moderate'
                              ? 'Recommendation: Review carefully before approving.'
                              : semanticCheck.verdict === 'low'
                              ? 'Recommendation: Safe to approve.'
                              : 'Recommendation: Safe to approve.'}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          {semanticCheck.matches.length === 0 ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              No similar projects found in the archive.
                            </div>
                          ) : (
                            semanticCheck.matches.map((m) => (
                              <div
                                key={m.projectId}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                              >
                                <div>
                                  <p className="text-sm font-bold text-gray-900 dark:text-white">{m.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {m.programme} • {m.department} • {m.year} • {m.student}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 md:justify-end">
                                  <div className="w-28 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-2 rounded-full ${
                                        m.score >= 70 ? 'bg-red-500' : m.score >= 40 ? 'bg-amber-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 w-10 text-right">
                                    {m.score}%
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

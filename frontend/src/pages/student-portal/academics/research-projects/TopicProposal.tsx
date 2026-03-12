import { useEffect, useMemo, useState } from 'react';
import { 
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Tag,
  Upload,
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TopicStatus = 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';

type StudentTopicProposal = {
  id: number;
  title: string;
  researchArea: string;
  abstract: string;
  keywords: string[];
  document: { name: string; size: number } | null;
  submittedAt: string;
  supervisor: string;
  status: TopicStatus;
  reviewerComment?: string;
  student: {
    name: string;
    matricNumber: string;
    department: string;
    faculty: string;
    programme: string;
  };
};

type StaffTopic = {
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
};

const STUDENT_PROPOSAL_KEY = 'student_research_topic_proposal';
const STAFF_TOPICS_KEY = 'staff_research_project_topics';

const currentStudent = {
  name: 'Sarah Johnson',
  matricNumber: 'CS/2020/001',
  department: 'Computer Science',
  faculty: 'Faculty of Science',
  programme: 'HND Computer Science'
};

const currentSupervisor = 'Dr. Sarah';

const loadStudentProposal = (): StudentTopicProposal | null => {
  const raw = localStorage.getItem(STUDENT_PROPOSAL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentTopicProposal;
  } catch {
    return null;
  }
};

const saveStudentProposal = (proposal: StudentTopicProposal) => {
  try {
    localStorage.setItem(STUDENT_PROPOSAL_KEY, JSON.stringify(proposal));
  } catch {
    return;
  }
};

const loadStaffTopics = (): StaffTopic[] => {
  const raw = localStorage.getItem(STAFF_TOPICS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StaffTopic[];
  } catch {
    return [];
  }
};

const saveStaffTopics = (topics: StaffTopic[]) => {
  try {
    localStorage.setItem(STAFF_TOPICS_KEY, JSON.stringify(topics));
  } catch {
    return;
  }
};

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
};

const TopicProposal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'submit' | 'view'>('submit');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [proposal, setProposal] = useState<StudentTopicProposal | null>(() => loadStudentProposal());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (proposal) setActiveTab('view');
  }, [proposal]);

  const statusFromStaff = useMemo(() => {
    if (!proposal) return null;
    const staffTopics = loadStaffTopics();
    const match = staffTopics.find(
      (t) =>
        t.matricNumber === proposal.student.matricNumber &&
        t.title.trim().toLowerCase() === proposal.title.trim().toLowerCase()
    );
    if (!match) return null;
    return match.status;
  }, [proposal]);

  const effectiveStatus = useMemo<TopicStatus>(() => {
    if (!proposal) return 'Pending';
    if (statusFromStaff === 'Approved') return 'Approved';
    if (statusFromStaff === 'Rejected') return 'Rejected';
    return proposal.status ?? 'Pending';
  }, [proposal, statusFromStaff]);

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={12} /> Rejected
          </span>
        );
      case 'Revision Required':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1">
            <Clock size={12} /> Revision Required
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  const handleSubmit = () => {
    setStatusMessage(null);
    const cleanTitle = title.trim();
    const cleanArea = researchArea.trim();
    const cleanAbstract = abstract.trim();
    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 12);

    if (!cleanTitle || !cleanArea || !cleanAbstract) {
      setStatusMessage({ type: 'error', text: 'Please complete project title, research area, and abstract.' });
      return;
    }

    const newProposal: StudentTopicProposal = {
      id: Date.now(),
      title: cleanTitle,
      researchArea: cleanArea,
      abstract: cleanAbstract,
      keywords,
      document: file ? { name: file.name, size: file.size } : null,
      submittedAt: new Date().toISOString(),
      supervisor: currentSupervisor,
      status: 'Pending',
      reviewerComment: 'Your proposal has been received and is pending review.',
      student: currentStudent
    };

    saveStudentProposal(newProposal);
    setProposal(newProposal);

    const staffTopics = loadStaffTopics();
    const existingIdx = staffTopics.findIndex(
      (t) => t.matricNumber === currentStudent.matricNumber && t.title.trim().toLowerCase() === cleanTitle.toLowerCase()
    );
    const staffTopic: StaffTopic = {
      id: newProposal.id,
      title: newProposal.title,
      student: newProposal.student.name,
      matricNumber: newProposal.student.matricNumber,
      department: newProposal.student.department,
      faculty: newProposal.student.faculty,
      programme: newProposal.student.programme,
      supervisor: newProposal.supervisor,
      date: newProposal.submittedAt.slice(0, 10),
      status: 'Pending',
      researchArea: newProposal.researchArea,
      keywords: newProposal.keywords,
      abstract: newProposal.abstract,
      documentUrl: '#'
    };
    const nextStaff = [...staffTopics];
    if (existingIdx >= 0) nextStaff[existingIdx] = staffTopic;
    else nextStaff.unshift(staffTopic);
    saveStaffTopics(nextStaff);

    setStatusMessage({ type: 'success', text: 'Topic proposal submitted successfully.' });
    setActiveTab('view');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Topic Proposal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit your research topic for approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Topic</h3>
              <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'submit'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Submit Proposal
                </button>
                <button
                  onClick={() => setActiveTab('view')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'view'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  View Project Topic
                </button>
              </div>
            </div>

            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
                  statusMessage.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-200'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-200'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {activeTab === 'submit' && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your proposed project title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Research Area</label>
                  <select
                    value={researchArea}
                    onChange={(e) => setResearchArea(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Research Area</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Abstract</label>
                  <textarea
                    rows={6}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Brief summary of your proposed research..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    placeholder="e.g. Machine Learning, Healthcare, Python (comma separated)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proposal Document (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                    <input
                      type="file"
                      id="proposal-upload"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="proposal-upload" className="cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF only (Max. 5MB)</p>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'view' && (
              <>
                {!proposal ? (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 flex items-center justify-center mx-auto mb-4">
                      <Eye size={22} />
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">No topic proposal submitted yet.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a proposal to view it here.</div>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      Submit Proposal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{proposal.title}</h4>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {new Date(proposal.submittedAt).toLocaleString()}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="inline-flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" />
                            {proposal.student.department}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(effectiveStatus)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Research Area</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{proposal.researchArea}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Supervisor</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{proposal.supervisor}</div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Abstract</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{proposal.abstract}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {proposal.keywords.length === 0 ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No keywords provided.</span>
                        ) : (
                          proposal.keywords.map((k) => (
                            <span
                              key={k}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm flex items-center gap-1"
                            >
                              <Tag size={12} /> {k}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Uploaded Document</div>
                      {proposal.document ? (
                        <div className="flex items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                              <FileText size={22} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">{proposal.document.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(proposal.document.size)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">Stored for review</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">No document uploaded.</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Submission Status</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Current Status</span>
              {getStatusBadge(effectiveStatus)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <p className="font-medium mb-1">Reviewer Comments:</p>
              <p className="italic text-gray-500">
                {proposal?.reviewerComment ?? 'Submit your proposal to receive reviewer feedback.'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-disc list-inside">
              <li>Abstract should not exceed 300 words.</li>
              <li>Include at least 5 relevant keywords.</li>
              <li>Ensure your topic aligns with your department's research focus.</li>
              <li>Upload only PDF format.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicProposal;

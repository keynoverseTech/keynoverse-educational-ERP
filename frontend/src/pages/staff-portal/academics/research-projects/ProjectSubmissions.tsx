import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Loader2,
  MessageSquare,
  Search,
  User,
  X,
  XCircle
} from 'lucide-react';
import { appendFeedbackMessage, ensureSubmissionThread, type FeedbackThreadStatus } from '../../../../utils/researchSupervisorFeedback';

type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';

type PlagiarismResult = {
  similarity: number;
  status: 'Safe' | 'Review Required' | 'High Risk';
  sources: Array<{ name: string; match: string }>;
  checkedAt: string;
};

type StudentProfile = {
  name: string;
  matricNumber: string;
  department: string;
  faculty: string;
  programme: string;
  supervisor: string;
  topicTitle: string;
};

type ProjectSubmission = {
  id: string;
  studentMatric: string;
  stage: string;
  title: string;
  version: string;
  uploadedAt: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: SubmissionStatus;
  supervisorComment: string;
  documentUrl: string;
  plagiarism: PlagiarismResult | null;
};

type ViewState = 'select_student' | 'student_submissions';

const STORAGE_KEY = 'staff_research_project_submissions';
const currentSupervisor = 'Dr. Sarah';

const loadSubmissions = (): ProjectSubmission[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ProjectSubmission[];
  } catch {
    return [];
  }
};

const saveSubmissions = (submissions: ProjectSubmission[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    return;
  }
};

const feedbackStatusFromSubmissionStatus = (status: SubmissionStatus): FeedbackThreadStatus => {
  if (status === 'Approved') return 'approved';
  if (status === 'Rejected') return 'rejected';
  if (status === 'Revision Required') return 'revision_required';
  return 'pending';
};

const seedStudents: StudentProfile[] = [
  {
    name: 'John Doe',
    matricNumber: 'CS/2020/001',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    programme: 'HND Computer Science',
    supervisor: currentSupervisor,
    topicTitle: 'AI in Healthcare'
  },
  {
    name: 'Jane Smith',
    matricNumber: 'CS/2020/015',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    programme: 'HND Computer Science',
    supervisor: currentSupervisor,
    topicTitle: 'Sustainable Energy Monitoring System'
  },
  {
    name: 'Michael Brown',
    matricNumber: 'CS/2020/042',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    programme: 'HND Computer Science',
    supervisor: currentSupervisor,
    topicTitle: 'Blockchain Voting System'
  }
];

const seedSubmissions = (): ProjectSubmission[] => [
  {
    id: 'sub-1',
    studentMatric: 'CS/2020/001',
    stage: 'Topic Proposal',
    title: 'Project Proposal Document',
    version: 'v1.0',
    uploadedAt: '2024-01-10T10:00:00.000Z',
    fileName: 'Project_Proposal.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    status: 'Approved',
    supervisorComment: 'Topic approved. Proceed to Chapter 1.',
    documentUrl: '#',
    plagiarism: null
  },
  {
    id: 'sub-2',
    studentMatric: 'CS/2020/001',
    stage: 'Chapter 1',
    title: 'Chapter 1 - Introduction',
    version: 'v1.0',
    uploadedAt: '2024-02-05T09:00:00.000Z',
    fileName: 'Chapter_1_Introduction.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    status: 'Approved',
    supervisorComment: 'Good start. Proceed to Chapter 2.',
    documentUrl: '#',
    plagiarism: {
      similarity: 8,
      status: 'Safe',
      sources: [{ name: 'Various Internet Sources', match: '8%' }],
      checkedAt: '2024-02-06T12:00:00.000Z'
    }
  },
  {
    id: 'sub-3',
    studentMatric: 'CS/2020/001',
    stage: 'Chapter 2',
    title: 'Chapter 2 - Literature Review',
    version: 'v1.0',
    uploadedAt: '2024-03-01T15:00:00.000Z',
    fileName: 'Chapter_2_Literature_Review.docx',
    fileSize: '3.1 MB',
    fileType: 'DOCX',
    status: 'Revision Required',
    supervisorComment: 'Needs more recent citations (2020-2024).',
    documentUrl: '#',
    plagiarism: null
  },
  {
    id: 'sub-4',
    studentMatric: 'CS/2020/015',
    stage: 'Topic Proposal',
    title: 'Project Proposal Document',
    version: 'v1.1',
    uploadedAt: '2024-01-12T12:00:00.000Z',
    fileName: 'Project_Proposal_Revised.pdf',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    status: 'Approved',
    supervisorComment: 'Approved. Start Chapter 1.',
    documentUrl: '#',
    plagiarism: null
  },
  {
    id: 'sub-5',
    studentMatric: 'CS/2020/015',
    stage: 'Chapter 1',
    title: 'Chapter 1 - Introduction',
    version: 'v1.0',
    uploadedAt: '2024-02-10T10:30:00.000Z',
    fileName: 'Chapter_1_Introduction.pdf',
    fileSize: '2.0 MB',
    fileType: 'PDF',
    status: 'Pending',
    supervisorComment: 'Under review.',
    documentUrl: '#',
    plagiarism: null
  },
  {
    id: 'sub-6',
    studentMatric: 'CS/2020/042',
    stage: 'Topic Proposal',
    title: 'Project Proposal Document',
    version: 'v1.0',
    uploadedAt: '2024-01-20T08:00:00.000Z',
    fileName: 'Project_Proposal.pdf',
    fileSize: '1.0 MB',
    fileType: 'PDF',
    status: 'Pending',
    supervisorComment: 'Pending review.',
    documentUrl: '#',
    plagiarism: null
  }
];

const getStatusBadge = (status: SubmissionStatus) => {
  if (status === 'Approved') {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 w-fit">
        <CheckCircle size={10} /> Approved
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1 w-fit">
        <XCircle size={10} /> Rejected
      </span>
    );
  }
  if (status === 'Revision Required') {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1 w-fit">
        <AlertCircle size={10} /> Revision
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1 w-fit">
      <AlertCircle size={10} /> Pending
    </span>
  );
};

const verdictFromSimilarity = (similarity: number): PlagiarismResult['status'] => {
  if (similarity >= 40) return 'High Risk';
  if (similarity >= 20) return 'Review Required';
  return 'Safe';
};

const StaffProjectSubmissions = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => {
    const existing = loadSubmissions();
    if (existing.length > 0) return existing;
    const seeded = seedSubmissions();
    saveSubmissions(seeded);
    return seeded;
  });

  const [viewState, setViewState] = useState<ViewState>('select_student');
  const [selectedStudentMatric, setSelectedStudentMatric] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'All'>('All');

  const [commentDraft, setCommentDraft] = useState('');
  const [plagiarismChecking, setPlagiarismChecking] = useState(false);

  useEffect(() => {
    saveSubmissions(submissions);
  }, [submissions]);

  const students = useMemo(() => {
    const inData = new Set(submissions.map((s) => s.studentMatric));
    return seedStudents.filter((st) => st.supervisor === currentSupervisor && inData.has(st.matricNumber));
  }, [submissions]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentMatric) return null;
    return students.find((s) => s.matricNumber === selectedStudentMatric) ?? null;
  }, [selectedStudentMatric, students]);

  const studentSubmissions = useMemo(() => {
    if (!selectedStudentMatric) return [];
    const filtered = submissions.filter((s) => s.studentMatric === selectedStudentMatric);
    const q = searchQuery.trim().toLowerCase();
    return filtered
      .filter((s) => (filterStatus === 'All' ? true : s.status === filterStatus))
      .filter((s) => {
        if (!q) return true;
        return (
          s.stage.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.fileName.toLowerCase().includes(q) ||
          s.version.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [filterStatus, searchQuery, selectedStudentMatric, submissions]);

  const selectedSubmission = useMemo(() => {
    if (!selectedSubmissionId) return null;
    return submissions.find((s) => s.id === selectedSubmissionId) ?? null;
  }, [selectedSubmissionId, submissions]);

  useEffect(() => {
    if (!selectedSubmission) return;
    setCommentDraft(selectedSubmission.supervisorComment ?? '');
  }, [selectedSubmission]);

  const openStudent = (matric: string) => {
    setSelectedStudentMatric(matric);
    setViewState('student_submissions');
    setSelectedSubmissionId(null);
  };

  const updateSubmission = (id: string, patch: Partial<ProjectSubmission>) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const notifyReviewOpened = (submission: ProjectSubmission, student: StudentProfile) => {
    const thread = ensureSubmissionThread({
      studentMatric: submission.studentMatric,
      threadId: submission.id,
      submissionLabel: `${submission.stage} (${submission.version})`,
      supervisorName: currentSupervisor,
      status: feedbackStatusFromSubmissionStatus(submission.status)
    });

    if (thread.messages.length === 0) {
      appendFeedbackMessage({
        studentMatric: submission.studentMatric,
        threadId: submission.id,
        sender: 'supervisor',
        text: `Hi ${student.name}, I have opened your submission for review.`,
        nextStatus: feedbackStatusFromSubmissionStatus(submission.status),
        supervisorName: currentSupervisor
      });
    }
  };

  const runPlagiarismTest = async (submission: ProjectSubmission) => {
    setPlagiarismChecking(true);
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 1600);
    });

    const base = Array.from(submission.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const similarity = Math.max(3, Math.min(65, (base % 58) + 7));
    const status = verdictFromSimilarity(similarity);
    const sources =
      similarity >= 40
        ? [
            { name: 'University Archive', match: '18%' },
            { name: 'ResearchGate', match: '12%' },
            { name: 'Wikipedia', match: '10%' }
          ]
        : similarity >= 20
          ? [
              { name: 'Wikipedia', match: '7%' },
              { name: 'Journal of AI Research', match: '6%' },
              { name: 'Various Internet Sources', match: `${Math.max(3, similarity - 13)}%` }
            ]
          : [{ name: 'Various Internet Sources', match: `${similarity}%` }];

    const result: PlagiarismResult = {
      similarity,
      status,
      sources,
      checkedAt: new Date().toISOString()
    };

    updateSubmission(submission.id, { plagiarism: result });
    setPlagiarismChecking(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-blue-600" />
            Submissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Review project documents uploaded by your assigned students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Assigned Students</h2>
            </div>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters, files..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map((st) => {
              const isActive = st.matricNumber === selectedStudentMatric;
              const count = submissions.filter((s) => s.studentMatric === st.matricNumber).length;
              return (
                <button
                  key={st.matricNumber}
                  onClick={() => openStudent(st.matricNumber)}
                  className={`w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 font-black">
                      {st.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-black text-gray-900 dark:text-white truncate">{st.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{st.matricNumber}</div>
                        </div>
                        <div className="text-xs font-black text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                          {count}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate">{st.topicTitle}</div>
                    </div>
                  </div>
                </button>
              );
            })}
            {students.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">No assigned students found.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black text-gray-900 dark:text-white">
                {viewState === 'student_submissions' && selectedStudent ? `${selectedStudent.name} — Submissions` : 'Select a student'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {viewState === 'student_submissions' && selectedStudent ? selectedStudent.topicTitle : 'Choose a student to review uploaded documents.'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | 'All')}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewState !== 'student_submissions'}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Revision Required">Revision Required</option>
              </select>
            </div>
          </div>

          {viewState !== 'student_submissions' || !selectedStudent ? (
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400 mb-4">
                <User size={28} />
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white">Select a student to view submissions</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">You can view proposal, chapters, and review details.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4">Version</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Comment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {studentSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white">{s.stage}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {s.fileName} • {s.fileSize}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono">{s.version}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(s.uploadedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{s.supervisorComment}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (selectedStudent) notifyReviewOpened(s, selectedStudent);
                              setSelectedSubmissionId(s.id);
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.open(s.documentUrl, '_blank', 'noopener,noreferrer')}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {studentSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-gray-400 italic">
                        No submissions found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedSubmission && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">Submission Details</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedStudent.name} ({selectedStudent.matricNumber}) • {selectedSubmission.stage} • {selectedSubmission.version}
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmissionId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{selectedSubmission.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {new Date(selectedSubmission.uploadedAt).toLocaleString()} • {selectedSubmission.fileType} • {selectedSubmission.fileSize}
                    </div>
                  </div>
                  <div>{getStatusBadge(selectedSubmission.status)}</div>
                </div>

                <div
                  onClick={() => window.open(selectedSubmission.documentUrl, '_blank', 'noopener,noreferrer')}
                  className="mt-4 flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 dark:text-white truncate">{selectedSubmission.fileName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Click to open</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(selectedSubmission.documentUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Student</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{selectedStudent.matricNumber}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {selectedStudent.programme} • {selectedStudent.department}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Project</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent.topicTitle}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Supervisor: {selectedStudent.supervisor}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wide">Plagiarism Test</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Run a similarity check and review matched sources.
                    </div>
                  </div>
                  <button
                    onClick={() => runPlagiarismTest(selectedSubmission)}
                    disabled={plagiarismChecking}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 ${
                      plagiarismChecking ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {plagiarismChecking ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Run Test
                      </>
                    )}
                  </button>
                </div>

                {selectedSubmission.plagiarism && (
                  <div className="mt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            selectedSubmission.plagiarism.status === 'High Risk'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : selectedSubmission.plagiarism.status === 'Review Required'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {selectedSubmission.plagiarism.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Similarity: <span className="font-black">{selectedSubmission.plagiarism.similarity}%</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Checked: {new Date(selectedSubmission.plagiarism.checkedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedSubmission.plagiarism.sources.map((src, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">{src.name}</span>
                          <span className="text-sm font-black text-red-600 dark:text-red-400">{src.match}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Supervisor Comment</div>
                <textarea
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Leave feedback or requested changes..."
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      updateSubmission(selectedSubmission.id, { supervisorComment: commentDraft });
                      if (commentDraft.trim()) {
                        ensureSubmissionThread({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          submissionLabel: `${selectedSubmission.stage} (${selectedSubmission.version})`,
                          supervisorName: currentSupervisor,
                          status: feedbackStatusFromSubmissionStatus(selectedSubmission.status)
                        });
                        appendFeedbackMessage({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          sender: 'supervisor',
                          text: commentDraft.trim(),
                          nextStatus: feedbackStatusFromSubmissionStatus(selectedSubmission.status),
                          supervisorName: currentSupervisor
                        });
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Save Comment
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        ensureSubmissionThread({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          submissionLabel: `${selectedSubmission.stage} (${selectedSubmission.version})`,
                          supervisorName: currentSupervisor,
                          status: 'rejected'
                        });
                        appendFeedbackMessage({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          sender: 'supervisor',
                          text: commentDraft.trim() ? `Rejected: ${commentDraft.trim()}` : 'Rejected.',
                          nextStatus: 'rejected',
                          supervisorName: currentSupervisor
                        });
                        updateSubmission(selectedSubmission.id, { status: 'Rejected', supervisorComment: commentDraft });
                        setSelectedSubmissionId(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors inline-flex items-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        ensureSubmissionThread({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          submissionLabel: `${selectedSubmission.stage} (${selectedSubmission.version})`,
                          supervisorName: currentSupervisor,
                          status: 'approved'
                        });
                        appendFeedbackMessage({
                          studentMatric: selectedSubmission.studentMatric,
                          threadId: selectedSubmission.id,
                          sender: 'supervisor',
                          text: commentDraft.trim() ? `Approved: ${commentDraft.trim()}` : 'Approved.',
                          nextStatus: 'approved',
                          supervisorName: currentSupervisor
                        });
                        updateSubmission(selectedSubmission.id, { status: 'Approved', supervisorComment: commentDraft });
                        setSelectedSubmissionId(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors inline-flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
              <button
                onClick={() => setSelectedSubmissionId(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffProjectSubmissions;

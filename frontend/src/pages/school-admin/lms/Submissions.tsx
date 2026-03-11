import { useMemo, useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from 'lucide-react';

type SubmissionStatus = 'Submitted' | 'Late' | 'Missing';
type SubmissionType = 'Assignment' | 'Quiz';

type SubmissionRow = {
  id: number;
  student: string;
  title: string;
  type: SubmissionType;
  course: string;
  date: string;
  status: SubmissionStatus;
  grade: string;
};

const Submissions = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | SubmissionType>('All');

  const submissions = [
    {
      id: 1,
      student: 'John Doe',
      title: 'Research Proposal Draft',
      type: 'Assignment',
      course: 'CSC 401',
      date: '2024-03-24',
      status: 'Submitted',
      grade: '18/20'
    } satisfies SubmissionRow,
    {
      id: 2,
      student: 'Jane Smith',
      title: 'Linear Algebra Problem Set',
      type: 'Assignment',
      course: 'MTH 302',
      date: '2024-03-28',
      status: 'Late',
      grade: 'Pending'
    } satisfies SubmissionRow,
    {
      id: 3,
      student: 'Michael Brown',
      title: 'Quiz 1: Lab Safety',
      type: 'Quiz',
      course: 'PHY 201',
      date: '-',
      status: 'Missing',
      grade: '-'
    } satisfies SubmissionRow,
  ] satisfies SubmissionRow[];

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions
      .filter((s) => (typeFilter === 'All' ? true : s.type === typeFilter))
      .filter((s) => {
        if (!q) return true;
        return (
          s.student.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q)
        );
      });
  }, [search, submissions, typeFilter]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="text-blue-600" />
            Submissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Track assignment and quiz submissions and grades.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, assignment, quiz, or course..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'All' | SubmissionType)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Assignment">Assignments</option>
              <option value="Quiz">Quizzes</option>
            </select>
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
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {sub.student}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    sub.type === 'Assignment' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {sub.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {sub.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold">{sub.course}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {sub.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    sub.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                    sub.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sub.status === 'Submitted' && <CheckCircle size={12} />}
                    {sub.status === 'Late' && <Clock size={12} />}
                    {sub.status === 'Missing' && <AlertTriangle size={12} />}
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {sub.grade}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600" title="View">
                      <Eye size={16} />
                    </button>
                    {sub.status !== 'Missing' && (
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Download">
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;

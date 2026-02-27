import React, { useMemo, useState } from 'react';
import { Award, Search, AlertCircle, FileText } from 'lucide-react';

type CourseResult = {
  code: string;
  title: string;
  units: number;
  score: number;
  grade: string;
};

type SemesterResult = {
  session: string;
  semester: 'First' | 'Second';
  cgpa: number;
  gpa: number;
  results: CourseResult[];
};

const RESULTS_DATA: SemesterResult[] = [
  {
    session: '2024/2025',
    semester: 'First',
    gpa: 4.22,
    cgpa: 3.85,
    results: [
      { code: 'CSC 401', title: 'Advanced Software Engineering', units: 3, score: 78, grade: 'A' },
      { code: 'CSC 415', title: 'Distributed Systems', units: 3, score: 72, grade: 'A' },
      { code: 'CSC 499', title: 'Final Year Project', units: 6, score: 65, grade: 'B' },
    ],
  },
  {
    session: '2024/2025',
    semester: 'Second',
    gpa: 4.05,
    cgpa: 3.90,
    results: [
      { code: 'CSC 402', title: 'Software Testing & QA', units: 3, score: 70, grade: 'A' },
      { code: 'CSC 420', title: 'Computer Security', units: 3, score: 62, grade: 'B' },
    ],
  },
];

const ResultsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSession, setActiveSession] = useState('2024/2025');
  const [activeSemester, setActiveSemester] = useState<'First' | 'Second'>('First');

  const selected = useMemo(() => RESULTS_DATA.find((d) => d.session === activeSession && d.semester === activeSemester), [activeSemester, activeSession]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!selected) return [];
    if (!q) return selected.results;
    return selected.results.filter((r) => `${r.code} ${r.title}`.toLowerCase().includes(q));
  }, [searchTerm, selected]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            Results
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">View your academic results by session and semester.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session</p>
          <select
            value={activeSession}
            onChange={(e) => setActiveSession(e.target.value)}
            className="mt-3 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 outline-none font-bold text-gray-900 dark:text-white"
          >
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semester</p>
          <div className="mt-3 flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl">
            {(['First', 'Second'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSemester(s)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex-1 ${
                  activeSemester === s ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Summary</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold">GPA</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{selected?.gpa.toFixed(2) ?? '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold">CGPA</p>
              <p className="text-2xl font-black text-purple-600">{selected?.cgpa.toFixed(2) ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search course code or title..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {selected ? (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={20} className="text-purple-600" />
              Course Results
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selected.session} • {selected.semester}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4 text-right">Units</th>
                  <th className="px-6 py-4 text-right">Score</th>
                  <th className="px-6 py-4 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map((r) => (
                  <tr key={r.code} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{r.code}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.title}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">{r.units}</td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">{r.score}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black border bg-purple-50 text-purple-600 border-purple-100">
                        {r.grade}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Results</h3>
          <p className="text-sm text-gray-500">Results are not available for the selected period.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;


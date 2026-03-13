import React, { useEffect, useMemo, useState } from 'react';
import { Activity, FileText, Search, ShieldCheck, Users } from 'lucide-react';
import type { ResearchOverviewData, ResearchSubmissionStatus, ResearchTopic, ResearchSubmission } from './research-types.ts';
import { researchOverviewService } from './research-service.ts';

const ResearchProjectsOverview: React.FC = () => {
  const [data, setData] = useState<ResearchOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'topics' | 'submissions'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResearchSubmissionStatus | 'All'>('All');

  useEffect(() => {
    researchOverviewService.getResearchOverviewData().then((res: ResearchOverviewData) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const filteredTopics = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.topics;
    return data.topics.filter((t: ResearchTopic) =>
      t.topic.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.programme.toLowerCase().includes(q) ||
      t.supervisor.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const filteredSubmissions = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.submissions.filter((s: ResearchSubmission) => {
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesSearch =
        !q ||
        s.student.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.supervisor.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [data, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[520px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading Research & Projects...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-[520px] flex flex-col items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800">
        <FileText size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load research data</h3>
        <p className="text-gray-500 mt-2 mb-6">We couldn't fetch the latest research information.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const getSubmissionBadge = (status: ResearchSubmissionStatus) => {
    if (status === 'Approved') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    if (status === 'Flagged') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Research & Projects</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Read-only overview of topics, submissions, plagiarism checks, and defense scheduling.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'topics', label: 'Topics', icon: FileText },
              { id: 'submissions', label: 'Submissions', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#151e32] text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white w-full"
            />
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Topics</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{data.summary.topics}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered</p>
          </div>
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Active Projects</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{data.summary.activeProjects}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ongoing</p>
          </div>
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Submissions</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{data.summary.pendingSubmissions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting review</p>
          </div>
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Plagiarism Checks</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{data.summary.plagiarismChecks}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
          </div>
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Defenses</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{data.summary.scheduledDefenses}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scheduled</p>
          </div>
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Supervisors</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{data.summary.supervisors}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assigned</p>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Topic</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Department</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Supervisor</th>
                  <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTopics.map((t: ResearchTopic) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{t.topic}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.code}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.programme}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.department}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.supervisor}</td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{t.updatedAt}</td>
                  </tr>
                ))}
                {filteredTopics.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No topics found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Flagged">Flagged</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Student</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Supervisor</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredSubmissions.map((s: ResearchSubmission) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{s.student}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{s.submittedAt}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.title}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.supervisor}</td>
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{s.course}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getSubmissionBadge(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchProjectsOverview;

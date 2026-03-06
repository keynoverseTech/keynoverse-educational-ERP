import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Calendar, Eye, Filter, Search, Users } from 'lucide-react';
import { admissionsOverviewService } from './service';
import type { AdmissionApplicant, AdmissionsOverviewData, AdmissionStatus } from './types';

const AdmissionsOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdmissionsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants'>('dashboard');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    admissionsOverviewService.getAdmissionsOverviewData().then(res => {
      setData(res);
      setSelectedSession(res.sessions[0]?.session ?? '2024/2025');
      setLoading(false);
    });
  }, []);

  const sessionSummary = useMemo(() => {
    if (!data) return null;
    return data.sessions.find(s => s.session === selectedSession) ?? data.sessions[0] ?? null;
  }, [data, selectedSession]);

  const applicantsForSession = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter(a => a.session === selectedSession);
  }, [data, selectedSession]);

  const filteredApplicants = useMemo(() => {
    const candidates = applicantsForSession;
    return candidates.filter(a => {
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        a.fullName.toLowerCase().includes(q) ||
        a.applicationNo.toLowerCase().includes(q) ||
        a.programme.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applicantsForSession, searchQuery, statusFilter]);

  const recentApplicants = useMemo(() => {
    return [...filteredApplicants]
      .sort((a, b) => (a.appliedDate ?? '') < (b.appliedDate ?? '') ? 1 : -1)
      .slice(0, 8);
  }, [filteredApplicants]);

  const getStatusBadge = (status: AdmissionStatus) => {
    if (status === 'Admitted') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
    if (status === 'Eligible') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
    if (status === 'Pending') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  };

  const openApplicant = (applicant: AdmissionApplicant) => {
    navigate('/super-admin/admissions-overview/applicant-details', { state: { applicant } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 font-medium">Loading Admissions Data...</p>
        </div>
      </div>
    );
  }

  if (!data || !sessionSummary) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <Users size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load admissions data</h3>
        <p className="text-gray-500 mt-2 mb-6">We couldn't fetch the latest admissions information.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admissions Overview</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monitor admissions sessions and applicants</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800">
              <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                {data.sessions.map(s => (
                  <option key={s.session} value={s.session}>
                    {s.session}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'applicants', label: 'Applicants', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dashboard' | 'applicants')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#151e32] text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Applications</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{sessionSummary.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Session: {sessionSummary.session}</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending</p>
              <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-2">{sessionSummary.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting review</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Eligible</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{sessionSummary.eligible}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Meets requirements</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Admitted</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{sessionSummary.admitted}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accepted students</p>
            </div>
            <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Rejected</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{sessionSummary.rejected}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not accepted</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Applicants</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent applications for {selectedSession}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, ID, programme..."
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white w-72"
                  />
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AdmissionStatus | 'All')}
                    className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Eligible">Eligible</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={() => setActiveTab('applicants')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Applicant</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Application No</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentApplicants.length > 0 ? (
                    recentApplicants.map(applicant => (
                      <tr key={applicant.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{applicant.fullName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{applicant.email}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{applicant.applicationNo}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{applicant.programme}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(applicant.status)}`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openApplicant(applicant)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No applicants found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applicants' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Applicants</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {filteredApplicants.length} records • Session {selectedSession}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, ID, programme..."
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white w-72"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AdmissionStatus | 'All')}
                  className="bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Applicant</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Programme</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Score</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map(applicant => (
                      <tr key={applicant.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{applicant.fullName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{applicant.applicationNo}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{applicant.programme}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{applicant.utmeScore ?? '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(applicant.status)}`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openApplicant(applicant)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No applicants found</p>
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

export default AdmissionsOverviewDashboard;


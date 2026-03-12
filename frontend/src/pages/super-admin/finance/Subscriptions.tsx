import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import superAdminService from '../../../services/superAdminApi';

type Row = {
  id: string;
  institution: string;
  plan: string;
  amount: number;
  status: 'Pending' | 'Active' | 'Suspended' | 'Expired' | 'Unknown';
  startDate?: string;
  endDate?: string;
};

const formatNaira = (amount: number) => `₦${Number(amount || 0).toLocaleString()}`;

const Subscriptions: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Active' | 'Suspended' | 'Expired'>('All');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetcher = async (key: string) => {
    switch (key) {
      case 'Pending': return await superAdminService.getSubscriptionsPending();
      case 'Active': return await superAdminService.getSubscriptionsActive();
      case 'Suspended': return await superAdminService.getSubscriptionsSuspended();
      case 'Expired': return await superAdminService.getSubscriptionsExpired();
      default: return await superAdminService.getSubscriptions();
    }
  };

  const statusLabel = (raw: any): Row['status'] => {
    const s = (raw || '').toString().toLowerCase();
    if (s.includes('pending')) return 'Pending';
    if (s.includes('active')) return 'Active';
    if (s.includes('suspend')) return 'Suspended';
    if (s.includes('expire')) return 'Expired';
    return 'Unknown';
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        let res: any;
        try {
          res = await fetcher(filter);
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 404 && filter !== 'All') {
            res = await superAdminService.getSubscriptions();
          } else {
            throw err;
          }
        }

        let data = Array.isArray(res) ? res : (res as any)?.data || [];
        if (filter !== 'All') {
          data = data.filter((it: any) => statusLabel(it.status) === filter);
        }
        const mapped: Row[] = data.map((it: any) => ({
          id: String(it.id ?? it.subscription_id ?? ''),
          institution: String(it.institution?.name ?? it.institution_name ?? it.name ?? 'Institution'),
          plan: String(it.plan?.name ?? it.plan_name ?? it.tier ?? 'Plan'),
          amount: Number(it.amount ?? it.price ?? it.fee ?? 0),
          status: statusLabel(it.status),
          startDate: it.start_date ?? it.startDate ?? it.begin_at ?? it.created_at ?? '',
          endDate: it.end_date ?? it.endDate ?? it.expiration_date ?? '',
        })).filter((r: Row) => r.id);
        setRows(mapped);
      } catch (err: any) {
        console.error('Failed to load subscriptions', err);
        setError('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r: Row) =>
      r.institution.toLowerCase().includes(q) ||
      r.plan.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400">Track institution subscription lifecycle and status.</p>
        </div>
        <div className="flex items-center gap-2">
          {['All','Pending','Active','Suspended','Expired'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                filter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-[#151e32] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by institution, plan, or status..."
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white w-full"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[240px]">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            <span>Loading subscriptions...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">End</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#0f172a] divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((r: Row) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{r.institution}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{r.plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{formatNaira(r.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      r.status === 'Active'
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : r.status === 'Pending'
                        ? 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : r.status === 'Suspended'
                        ? 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
                        : r.status === 'Expired'
                        ? 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        : 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}>
                      {r.status === 'Active' && <CheckCircle2 size={12} />}
                      {r.status === 'Pending' && <AlertTriangle size={12} />}
                      {r.status === 'Suspended' && <XCircle size={12} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{r.startDate || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{r.endDate || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No subscriptions found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStudentTransport, type TransportApplicationStatus } from '../../../../state/studentTransportContext';
import { SkeletonRow, StatusPill, ToastViewport, TransportSubnav } from './StudentTransportShared';

type StatusFilter = 'All' | TransportApplicationStatus;

const StudentTransportHistory: React.FC = () => {
  const { ready, toasts, dismissToast, currentStudent, applications, routes, getStopsForRoute } = useStudentTransport();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');

  const routeById = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes]);

  const rows = useMemo(() => {
    if (!currentStudent) return [];
    return applications
      .filter(a => a.studentId === currentStudent.id)
      .filter(a => (status === 'All' ? true : a.status === status))
      .filter(a => {
        const route = routeById.get(a.routeId);
        const stop = getStopsForRoute(a.routeId).find(s => s.id === a.stopId);
        const text = `${route?.routeName ?? ''} ${stop?.stopName ?? ''} ${a.semester} ${a.status}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [applications, currentStudent, getStopsForRoute, routeById, search, status]);

  const badge = (s: TransportApplicationStatus) => {
    if (s === 'Approved') return <StatusPill label="Approved" tone="green" />;
    if (s === 'Pending') return <StatusPill label="Pending" tone="amber" />;
    if (s === 'Rejected') return <StatusPill label="Rejected" tone="red" />;
    return <StatusPill label="Expired" tone="gray" />;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your applications and statuses.</p>
        </div>
        <TransportSubnav
          items={[
            { label: 'Dashboard', to: '/student/services/transport' },
            { label: 'Available Routes', to: '/student/services/transport/available' },
            { label: 'Apply for Transport', to: '/student/services/transport/apply' },
            { label: 'My Transport', to: '/student/services/transport/my-transport' },
            { label: 'Transport History', to: '/student/services/transport/history' },
          ]}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search route, stop, semester, status..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-bold text-gray-900 dark:text-white">No applications found</p>
                    <p className="text-sm mt-1">Apply for transport to see history here.</p>
                  </td>
                </tr>
              ) : (
                rows.map(a => {
                  const route = routeById.get(a.routeId);
                  const stop = getStopsForRoute(a.routeId).find(s => s.id === a.stopId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{route?.routeName ?? 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{stop?.stopName ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{a.semester}</td>
                      <td className="px-6 py-4">{badge(a.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{a.createdAt.slice(0, 10)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTransportHistory;


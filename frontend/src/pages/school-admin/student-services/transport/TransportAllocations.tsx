import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';
import { SkeletonRow, StatusPill, TransportSubnav } from './TransportShared';

type StatusFilter = 'All' | 'Active' | 'Expired';

const TransportAllocations: React.FC = () => {
  const { routes, vehicles, allocations, expireAllocation } = useTransport();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [busId, setBusId] = useState<'All' | string>('All');
  const [routeId, setRouteId] = useState<'All' | string>('All');

  const busById = useMemo(() => new Map(vehicles.map(v => [v.id, v])), [vehicles]);
  const routeById = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes]);

  const filtered = useMemo(() => {
    return allocations
      .filter(a => (status === 'All' ? true : a.status === status))
      .filter(a => (busId === 'All' ? true : a.busId === busId))
      .filter(a => (routeId === 'All' ? true : a.routeId === routeId))
      .filter(a => `${a.studentName} ${a.studentId}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allocations, busId, routeId, search, status]);

  const badge = (s: 'Active' | 'Expired') => (s === 'Active' ? <StatusPill label="Active" tone="green" /> : <StatusPill label="Expired" tone="gray" />);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Allocations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage student allocations to buses.</p>
        </div>
        <TransportSubnav
          items={[
            { label: 'Dashboard', to: '/school-admin/student-services/transport' },
            { label: 'Buses', to: '/school-admin/student-services/transport/buses' },
            { label: 'Routes', to: '/school-admin/student-services/transport/routes' },
            { label: 'Bus Stops', to: '/school-admin/student-services/transport/stops' },
            { label: 'Requests', to: '/school-admin/student-services/transport/requests' },
            { label: 'Allocations', to: '/school-admin/student-services/transport/allocations' },
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
              placeholder="Search student name or ID..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={busId}
            onChange={e => setBusId(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Buses</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.busNumber}
              </option>
            ))}
          </select>
          <select
            value={routeId}
            onChange={e => setRouteId(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Routes</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.routeName}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bus</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seat Number</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16">
                    <SkeletonRow />
                  </td>
                </tr>
              ) : (
                filtered.map(a => {
                  const bus = busById.get(a.busId);
                  const route = routeById.get(a.routeId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{a.studentName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{a.studentId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{bus?.busNumber ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{route?.routeName ?? '—'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{a.seatNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{a.semester}</td>
                      <td className="px-6 py-4">{badge(a.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'Active' ? (
                            <button
                              type="button"
                              onClick={() => expireAllocation(a.id)}
                              className="px-3 py-2 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Expire
                            </button>
                          ) : null}
                        </div>
                      </td>
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

export default TransportAllocations;


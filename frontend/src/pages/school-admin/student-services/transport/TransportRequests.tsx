import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, Search } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';
import { Modal, SkeletonRow, StatusPill, TransportSubnav } from './TransportShared';

const TransportRequests: React.FC = () => {
  const { routes, vehicles, transportRequests, approveRequest, rejectRequest, busAvailableSeats } = useTransport();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [busId, setBusId] = useState<string>('');
  const [seatNumber, setSeatNumber] = useState<string>('S1');

  const routeById = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes]);

  const filtered = useMemo(() => {
    return transportRequests
      .filter(r => (status === 'All' ? true : r.status === status))
      .filter(r => `${r.studentName} ${r.studentId}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  }, [search, status, transportRequests]);

  const openDetails = (id: string) => {
    setActiveRequestId(id);
    const req = transportRequests.find(r => r.id === id);
    if (req) {
      const busesOnRoute = vehicles.filter(v => v.routeId === req.routeId);
      setBusId(busesOnRoute[0]?.id ?? '');
      setSeatNumber(`S${(busAvailableSeats(busesOnRoute[0]?.id ?? '') || 1)}`);
    }
    setDetailsOpen(true);
  };

  const badge = (s: 'Pending' | 'Approved' | 'Rejected') =>
    s === 'Approved' ? <StatusPill label="Approved" tone="green" /> : s === 'Rejected' ? <StatusPill label="Rejected" tone="red" /> : <StatusPill label="Pending" tone="amber" />;

  const doApprove = () => {
    if (!activeRequestId || !busId) return;
    approveRequest(activeRequestId, busId, seatNumber || 'S1', '2025/2026 • Second');
    setDetailsOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and approve or reject student requests.</p>
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
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route Requested</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <SkeletonRow />
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const route = routeById.get(r.routeId);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{r.studentName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{r.studentId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{r.level}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{route?.routeName ?? 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{r.requestDate}</td>
                      <td className="px-6 py-4">{badge(r.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetails(r.id)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {r.status === 'Pending' ? (
                            <>
                              <button type="button" onClick={() => openDetails(r.id)} className="px-3 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectRequest(r.id)}
                                className="px-3 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
                              >
                                Reject
                              </button>
                            </>
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

      <Modal
        title="Request Details"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Close
            </button>
            <button type="button" onClick={doApprove} className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-2">
              <CheckCircle2 size={18} />
              Approve & Allocate
            </button>
          </div>
        }
      >
        {activeRequestId ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Assign Bus</label>
                <select
                  value={busId}
                  onChange={e => setBusId(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.busNumber} • {v.driver} • {v.capacity} seats
                    </option>
                  ))}
                </select>
                {busId ? <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{busAvailableSeats(busId)} available seats</p> : null}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Seat Number</label>
                <input
                  value={seatNumber}
                  onChange={e => setSeatNumber(e.target.value)}
                  placeholder="e.g. S12"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300">Select a request to view details.</div>
        )}
      </Modal>
    </div>
  );
};

export default TransportRequests;

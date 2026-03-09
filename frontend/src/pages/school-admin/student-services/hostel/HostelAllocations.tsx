import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useHostel, type AllocationStatus } from '../../../../state/hostelContext';
import { HostelSubnav, SkeletonRow, StatusPill, ToastViewport } from './HostelShared';

type StatusFilter = 'All' | AllocationStatus;

const HostelAllocations: React.FC = () => {
  const { ready, hostels, rooms, allocations, completeAllocation, expireAllocation, toasts, dismissToast } = useHostel();

  const [search, setSearch] = useState('');
  const [hostelId, setHostelId] = useState<'All' | string>('All');
  const [status, setStatus] = useState<StatusFilter>('All');

  const hostelById = useMemo(() => new Map(hostels.map(h => [h.id, h])), [hostels]);
  const roomById = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

  const filtered = useMemo(() => {
    return allocations
      .filter(a => {
        const matchesSearch =
          a.studentName.toLowerCase().includes(search.toLowerCase()) || a.studentId.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (hostelId !== 'All' && a.hostelId !== hostelId) return false;
        if (status !== 'All' && a.status !== status) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allocations, hostelId, search, status]);

  const badge = (s: AllocationStatus) => {
    if (s === 'Active') return <StatusPill label="Active" tone="green" />;
    if (s === 'Expired') return <StatusPill label="Expired" tone="amber" />;
    return <StatusPill label="Completed" tone="gray" />;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room Allocations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track active and historical allocations across hostels.</p>
        </div>

        <HostelSubnav
          items={[
            { label: 'Dashboard', to: '/school-admin/student-services/hostel' },
            { label: 'Hostels', to: '/school-admin/student-services/hostel/hostels' },
            { label: 'Rooms', to: '/school-admin/student-services/hostel/rooms' },
            { label: 'Allocation Rules', to: '/school-admin/student-services/hostel/rules' },
            { label: 'Booking Requests', to: '/school-admin/student-services/hostel/requests' },
            { label: 'Allocations', to: '/school-admin/student-services/hostel/allocations' },
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
            value={hostelId}
            onChange={e => setHostelId(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>
                {h.hostelName}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hostel</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bed Space</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-bold text-gray-900 dark:text-white">No allocations found</p>
                    <p className="text-sm mt-1">Approve booking requests to generate allocations.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(a => {
                  const hostel = hostelById.get(a.hostelId);
                  const room = roomById.get(a.roomId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{a.studentName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{a.studentId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{hostel?.hostelName ?? 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{room?.roomNumber ?? 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{a.bedSpace}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{a.startSemester}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{a.endSemester}</td>
                      <td className="px-6 py-4">{badge(a.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'Active' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => completeAllocation(a.id)}
                                className="px-3 py-2 rounded-xl text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                              >
                                Complete
                              </button>
                              <button
                                type="button"
                                onClick={() => expireAllocation(a.id)}
                                className="px-3 py-2 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Expire
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
    </div>
  );
};

export default HostelAllocations;

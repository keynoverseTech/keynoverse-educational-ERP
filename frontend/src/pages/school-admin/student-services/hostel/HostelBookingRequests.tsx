import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, Plus, Search, XCircle } from 'lucide-react';
import { useHostel, type HostelBookingRequest, type HostelGender } from '../../../../state/hostelContext';
import { HostelSubnav, Modal, SkeletonRow, StatusPill, ToastViewport } from './HostelShared';

type StatusFilter = 'All' | HostelBookingRequest['status'];

const levelOptions = ['100', '200', '300', '400', '500'] as const;

const HostelBookingRequests: React.FC = () => {
  const {
    ready,
    hostels,
    rooms,
    bookingRequests,
    approveBookingRequest,
    rejectBookingRequest,
    seedBookingRequest,
    toasts,
    dismissToast,
  } = useHostel();

  const [search, setSearch] = useState('');
  const [hostelId, setHostelId] = useState<'All' | string>('All');
  const [gender, setGender] = useState<'All' | HostelGender>('All');
  const [level, setLevel] = useState<'All' | string>('All');
  const [status, setStatus] = useState<StatusFilter>('All');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [overrideHostelId, setOverrideHostelId] = useState<string>('');
  const [overrideRoomId, setOverrideRoomId] = useState<string | null>(null);

  const hostelById = useMemo(() => new Map(hostels.map(h => [h.id, h])), [hostels]);
  const roomById = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

  const filtered = useMemo(() => {
    return bookingRequests
      .filter(r => {
        const matchesSearch =
          r.studentName.toLowerCase().includes(search.toLowerCase()) || r.studentId.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (status !== 'All' && r.status !== status) return false;
        if (gender !== 'All' && r.gender !== gender) return false;
        if (level !== 'All' && r.level !== level) return false;
        if (hostelId !== 'All' && r.requestedHostelId !== hostelId) return false;
        return true;
      })
      .sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  }, [bookingRequests, gender, hostelId, level, search, status]);

  const activeRequest = useMemo(() => {
    return activeRequestId ? bookingRequests.find(r => r.id === activeRequestId) ?? null : null;
  }, [activeRequestId, bookingRequests]);

  const openDetails = (requestId: string) => {
    const req = bookingRequests.find(r => r.id === requestId);
    if (!req) return;
    setActiveRequestId(req.id);
    setOverrideHostelId(req.requestedHostelId);
    setOverrideRoomId(req.requestedRoomId);
    setDetailsOpen(true);
  };

  const availableRoomsForSelection = useMemo(() => {
    if (!activeRequest) return [];
    const hId = overrideHostelId || activeRequest.requestedHostelId;
    return rooms
      .filter(r => r.hostelId === hId)
      .map(r => {
        const availableBeds = r.bedCapacity - r.occupiedBeds;
        return { room: r, availableBeds };
      })
      .sort((a, b) => b.availableBeds - a.availableBeds);
  }, [activeRequest, overrideHostelId, rooms]);

  const badgeForStatus = (s: HostelBookingRequest['status']) => {
    if (s === 'Approved') return <StatusPill label="Approved" tone="green" />;
    if (s === 'Rejected') return <StatusPill label="Rejected" tone="red" />;
    return <StatusPill label="Pending" tone="amber" />;
  };

  const approveFromList = (id: string) => {
    openDetails(id);
  };

  const approveFromModal = () => {
    if (!activeRequestId) return;
    approveBookingRequest(activeRequestId, { hostelId: overrideHostelId, roomId: overrideRoomId });
    setDetailsOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review student requests and allocate rooms.</p>
          </div>
          <button
            type="button"
            onClick={seedBookingRequest}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-xl font-bold text-gray-700 dark:text-gray-200"
          >
            <Plus size={18} />
            Add Mock Request
          </button>
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
            value={gender}
            onChange={e => setGender(e.target.value as 'All' | HostelGender)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Levels</option>
            {levelOptions.map(l => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Status</option>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested Hostel</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested Room</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request Date</th>
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
                    <p className="font-bold text-gray-900 dark:text-white">No booking requests</p>
                    <p className="text-sm mt-1">Adjust filters or add a mock request.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const hostel = hostelById.get(r.requestedHostelId);
                  const room = r.requestedRoomId ? roomById.get(r.requestedRoomId) : null;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{r.studentName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{r.studentId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{r.level}</td>
                      <td className="px-6 py-4">
                        <StatusPill label={r.gender} tone={r.gender === 'Male' ? 'blue' : 'purple'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{hostel?.hostelName ?? 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{room?.roomNumber ?? 'Any'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{r.requestDate}</td>
                      <td className="px-6 py-4">{badgeForStatus(r.status)}</td>
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
                              <button
                                type="button"
                                onClick={() => approveFromList(r.id)}
                                className="px-3 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectBookingRequest(r.id)}
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
        widthClassName="max-w-2xl"
        footer={
          activeRequest?.status === 'Pending' ? (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeRequestId) rejectBookingRequest(activeRequestId);
                  setDetailsOpen(false);
                }}
                className="px-4 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 inline-flex items-center gap-2"
              >
                <XCircle size={18} />
                Reject
              </button>
              <button
                type="button"
                onClick={approveFromModal}
                className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                Approve & Allocate
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          )
        }
      >
        {activeRequest ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{activeRequest.studentName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{activeRequest.studentId}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusPill label={`Level ${activeRequest.level}`} tone="blue" />
                  <StatusPill label={activeRequest.gender} tone={activeRequest.gender === 'Male' ? 'blue' : 'purple'} />
                  {badgeForStatus(activeRequest.status)}
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request</p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">Requested hostel and room (can override before approval).</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submitted: {activeRequest.requestDate}</p>
              </div>
            </div>

            {activeRequest.status === 'Pending' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Allocate Hostel</label>
                  <select
                    value={overrideHostelId}
                    onChange={e => {
                      setOverrideHostelId(e.target.value);
                      setOverrideRoomId(null);
                    }}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    {hostels
                      .filter(h => h.gender === activeRequest.gender)
                      .map(h => (
                        <option key={h.id} value={h.id}>
                          {h.hostelName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Allocate Room</label>
                  <select
                    value={overrideRoomId ?? ''}
                    onChange={e => setOverrideRoomId(e.target.value || null)}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select room</option>
                    {availableRoomsForSelection.map(({ room, availableBeds }) => (
                      <option key={room.id} value={room.id} disabled={availableBeds <= 0}>
                        {room.roomNumber} • {room.roomType} • {availableBeds} beds available
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300">Select a request to view details.</div>
        )}
      </Modal>
    </div>
  );
};

export default HostelBookingRequests;


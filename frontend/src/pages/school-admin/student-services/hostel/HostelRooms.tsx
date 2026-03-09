import React, { useMemo, useState } from 'react';
import { Plus, Search, Edit3, Trash2, BedDouble } from 'lucide-react';
import { useHostel, type HostelGender, type RoomType } from '../../../../state/hostelContext';
import { ConfirmDialog, HostelSubnav, Modal, SkeletonRow, StatusPill, ToastViewport } from './HostelShared';

type RoomStatusFilter = 'All' | 'Available' | 'Partially Occupied' | 'Full';

const HostelRooms: React.FC = () => {
  const { ready, hostels, rooms, createRoom, updateRoom, deleteRoom, toasts, dismissToast } = useHostel();

  const [search, setSearch] = useState('');
  const [hostelId, setHostelId] = useState<'All' | string>('All');
  const [gender, setGender] = useState<'All' | HostelGender>('All');
  const [status, setStatus] = useState<RoomStatusFilter>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formHostelId, setFormHostelId] = useState<string>(hostels[0]?.id ?? '');
  const [roomNumber, setRoomNumber] = useState('');
  const [bedCapacity, setBedCapacity] = useState(4);
  const [roomType, setRoomType] = useState<RoomType>('Standard');

  const hostelById = useMemo(() => new Map(hostels.map(h => [h.id, h])), [hostels]);

  const filtered = useMemo(() => {
    return rooms
      .map(r => ({ room: r, hostel: hostelById.get(r.hostelId) }))
      .filter(row => {
        if (!row.hostel) return false;
        if (hostelId !== 'All' && row.room.hostelId !== hostelId) return false;
        if (gender !== 'All' && row.hostel.gender !== gender) return false;
        const matchesSearch = `${row.room.roomNumber}`.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        const availableBeds = row.room.bedCapacity - row.room.occupiedBeds;
        const computedStatus: RoomStatusFilter =
          availableBeds === 0 ? 'Full' : row.room.occupiedBeds === 0 ? 'Available' : 'Partially Occupied';

        return status === 'All' || status === computedStatus;
      })
      .sort((a, b) => a.room.roomNumber.localeCompare(b.room.roomNumber));
  }, [gender, hostelById, hostelId, rooms, search, status]);

  const openCreate = () => {
    setEditingId(null);
    setFormHostelId(hostels[0]?.id ?? '');
    setRoomNumber('');
    setBedCapacity(4);
    setRoomType('Standard');
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const r = rooms.find(x => x.id === id);
    if (!r) return;
    setEditingId(r.id);
    setFormHostelId(r.hostelId);
    setRoomNumber(r.roomNumber);
    setBedCapacity(r.bedCapacity);
    setRoomType(r.roomType);
    setFormOpen(true);
  };

  const submit = () => {
    const trimmed = roomNumber.trim();
    if (!trimmed || !formHostelId) return;
    if (editingId) {
      updateRoom(editingId, { hostelId: formHostelId, roomNumber: trimmed, bedCapacity, roomType });
    } else {
      createRoom({ hostelId: formHostelId, roomNumber: trimmed, bedCapacity, roomType });
    }
    setFormOpen(false);
  };

  const requestDelete = (id: string) => {
    setTargetRoomId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!targetRoomId) return;
    deleteRoom(targetRoomId);
    setTargetRoomId(null);
  };

  const statusTone = (occupied: number, capacity: number) => {
    if (occupied >= capacity) return { label: 'Full', tone: 'red' as const };
    if (occupied === 0) return { label: 'Available', tone: 'green' as const };
    return { label: 'Partially Occupied', tone: 'amber' as const };
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage rooms, bed capacity, and occupancy status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
          >
            <Plus size={18} />
            Add Room
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
              placeholder="Search room number..."
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
            value={status}
            onChange={e => setStatus(e.target.value as RoomStatusFilter)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Partially Occupied">Partially Occupied</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hostel</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Occupied</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Beds</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-bold text-gray-900 dark:text-white">No rooms found</p>
                    <p className="text-sm mt-1">Adjust filters or add a room.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(({ room, hostel }) => {
                  const availableBeds = room.bedCapacity - room.occupiedBeds;
                  const s = statusTone(room.occupiedBeds, room.bedCapacity);
                  return (
                    <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200">
                            <BedDouble size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{room.roomNumber}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{room.roomType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">{hostel?.hostelName ?? 'Unknown'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{hostel?.gender ?? ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{room.bedCapacity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{room.occupiedBeds}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{availableBeds}</td>
                      <td className="px-6 py-4">
                        <StatusPill label={s.label} tone={s.tone} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(room.id)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(room.id)}
                            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
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
        title={editingId ? 'Edit Room' : 'Add Room'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button type="button" onClick={submit} className="px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Select Hostel</label>
            <select
              value={formHostelId}
              onChange={e => setFormHostelId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              {hostels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.hostelName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Room Number</label>
              <input
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. 101"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Bed Capacity</label>
              <input
                type="number"
                min={1}
                value={bedCapacity}
                onChange={e => setBedCapacity(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Room Type</label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value as RoomType)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete room?"
        description="This will remove the room and any associated allocations."
        confirmLabel="Delete"
        confirmTone="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default HostelRooms;

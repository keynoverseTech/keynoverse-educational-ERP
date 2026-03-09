import React, { useMemo, useState } from 'react';
import { Plus, Search, Edit3, Trash2, Building2 } from 'lucide-react';
import { useHostel, type HostelGender } from '../../../../state/hostelContext';
import { ConfirmDialog, HostelSubnav, Modal, SkeletonRow, StatusPill, ToastViewport } from './HostelShared';

const HostelBuildings: React.FC = () => {
  const { ready, hostels, rooms, createHostel, updateHostel, deleteHostel, toasts, dismissToast } = useHostel();

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<'All' | HostelGender>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetHostelId, setTargetHostelId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [hostelName, setHostelName] = useState('');
  const [hostelGender, setHostelGender] = useState<HostelGender>('Male');
  const [totalFloors, setTotalFloors] = useState(1);
  const [description, setDescription] = useState('');

  const rows = useMemo(() => {
    const filtered = hostels.filter(h => {
      const matchesGender = gender === 'All' || h.gender === gender;
      const matchesSearch = h.hostelName.toLowerCase().includes(search.toLowerCase());
      return matchesGender && matchesSearch;
    });

    return filtered.map(h => {
      const totalRooms = rooms.filter(r => r.hostelId === h.id).length;
      return { hostel: h, totalRooms };
    });
  }, [gender, hostels, rooms, search]);

  const openCreate = () => {
    setEditingId(null);
    setHostelName('');
    setHostelGender('Male');
    setTotalFloors(1);
    setDescription('');
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const h = hostels.find(x => x.id === id);
    if (!h) return;
    setEditingId(h.id);
    setHostelName(h.hostelName);
    setHostelGender(h.gender);
    setTotalFloors(h.totalFloors);
    setDescription(h.description);
    setFormOpen(true);
  };

  const submit = () => {
    const trimmed = hostelName.trim();
    if (!trimmed) return;

    if (editingId) {
      updateHostel(editingId, { hostelName: trimmed, gender: hostelGender, totalFloors, description });
    } else {
      createHostel({ hostelName: trimmed, gender: hostelGender, totalFloors, description });
    }

    setFormOpen(false);
  };

  const requestDelete = (id: string) => {
    setTargetHostelId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!targetHostelId) return;
    deleteHostel(targetHostelId);
    setTargetHostelId(null);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Buildings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, and manage hostel buildings.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
          >
            <Plus size={18} />
            Add Hostel
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
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hostel name..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={gender}
            onChange={e => setGender(e.target.value as 'All' | HostelGender)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hostel Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Floors</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Rooms</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto w-full max-w-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto text-gray-500 dark:text-gray-300">
                        <Building2 size={22} />
                      </div>
                      <p className="mt-4 font-bold text-gray-900 dark:text-white">No hostels found</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first hostel to begin managing rooms.</p>
                      <button
                        type="button"
                        onClick={openCreate}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                      >
                        <Plus size={18} />
                        Add Hostel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map(row => (
                  <tr key={row.hostel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{row.hostel.hostelName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[640px]">{row.hostel.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill label={row.hostel.gender} tone={row.hostel.gender === 'Male' ? 'blue' : 'purple'} />
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{row.hostel.totalFloors}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{row.totalRooms}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row.hostel.id)}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(row.hostel.id)}
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editingId ? 'Edit Hostel' : 'Add Hostel'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Hostel Name</label>
              <input
                value={hostelName}
                onChange={e => setHostelName(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Unity Hostel"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Gender</label>
              <select
                value={hostelGender}
                onChange={e => setHostelGender(e.target.value as HostelGender)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Total Floors</label>
              <input
                type="number"
                min={1}
                value={totalFloors}
                onChange={e => setTotalFloors(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Short description for admins..."
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete hostel?"
        description="This will remove the hostel and all associated rooms, requests, and allocations."
        confirmLabel="Delete"
        confirmTone="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default HostelBuildings;


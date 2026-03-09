import React, { useMemo, useState } from 'react';
import { Bus, Edit3, Search, Trash2 } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';
import { Modal, SkeletonRow, StatusPill, TransportSubnav } from './TransportShared';

const BusManagement: React.FC = () => {
  const { vehicles, routes, addVehicle, updateVehicle, deleteVehicle, busOccupiedSeats, busAvailableSeats } = useTransport();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [busNumber, setBusNumber] = useState('');
  const [model, setModel] = useState('');
  const [driverName, setDriverName] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [routeId, setRouteId] = useState<string>('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vehicles.filter(v => `${v.busNumber} ${v.model} ${v.driver}`.toLowerCase().includes(q));
  }, [search, vehicles]);

  const openCreate = () => {
    setEditingId(null);
    setBusNumber('');
    setModel('');
    setDriverName('');
    setCapacity(40);
    setRouteId(routes[0]?.id ?? '');
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const v = vehicles.find(x => x.id === id);
    if (!v) return;
    setEditingId(v.id);
    setBusNumber(v.busNumber);
    setModel(v.model);
    setDriverName(v.driver);
    setCapacity(v.capacity);
    setRouteId(v.routeId ?? '');
    setFormOpen(true);
  };

  const submit = () => {
    if (!busNumber.trim() || !driverName.trim()) return;
    const data = { busNumber: busNumber.trim(), model, driver: driverName.trim(), capacity, routeId, status: 'Active' as const };
    if (editingId) updateVehicle(editingId, data);
    else addVehicle(data);
    setFormOpen(false);
  };

  const routeName = (id?: string) => routes.find(r => r.id === id)?.routeName ?? 'Unassigned';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bus Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Add, edit, and manage buses and drivers.</p>
          </div>
          <button type="button" onClick={openCreate} className="px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2">
            <Bus size={18} />
            Add Bus
          </button>
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
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bus number, model, or driver..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bus Number</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Route</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Occupied Seats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(v => {
                const occupied = busOccupiedSeats(v.id);
                const available = busAvailableSeats(v.id);
                const tone = available === 0 ? ('red' as const) : available <= Math.ceil(v.capacity * 0.2) ? ('amber' as const) : ('green' as const);
                return (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{v.busNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{v.driver}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{v.capacity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{routeName(v.routeId)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusPill label={`${occupied}/${v.capacity}`} tone={tone} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{available} available</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill label={v.status} tone={v.status === 'Active' ? 'green' : 'amber'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(v.id)}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVehicle(v.id)}
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <SkeletonRow />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editingId ? 'Edit Bus' : 'Add Bus'}
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
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Bus Number</label>
              <input
                value={busNumber}
                onChange={e => setBusNumber(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Seat Capacity</label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Driver Name</label>
              <input
                value={driverName}
                onChange={e => setDriverName(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Assign Route</label>
              <select
                value={routeId}
                onChange={e => setRouteId(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.routeName}
                  </option>
                ))}
                {routes.length === 0 ? <option value="">No routes</option> : null}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Model</label>
            <input
              value={model}
              onChange={e => setModel(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Toyota Coaster"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusManagement;


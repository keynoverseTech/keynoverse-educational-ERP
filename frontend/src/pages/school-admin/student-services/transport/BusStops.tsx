import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';
import { Modal, SkeletonRow, TransportSubnav } from './TransportShared';

const BusStops: React.FC = () => {
  const { routes, addStopToRoute, updateStopOnRoute, deleteStopFromRoute } = useTransport();
  const [search, setSearch] = useState('');
  const [routeId, setRouteId] = useState<string>(routes[0]?.id ?? '');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stopName, setStopName] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const allStops = useMemo(() => {
    const result: Array<{ routeId: string; routeName: string; id: string; name: string; time: string }> = [];
    routes.forEach(r => {
      r.stops.forEach(s => result.push({ routeId: r.id, routeName: r.routeName, id: s.id, name: s.name, time: s.time }));
    });
    return result
      .filter(s => `${s.name} ${s.routeName}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.routeName.localeCompare(b.routeName));
  }, [routes, search]);

  const openCreate = () => {
    setEditingId(null);
    setStopName('');
    setPickupTime('');
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const s = allStops.find(x => x.id === id);
    if (!s) return;
    setEditingId(s.id);
    setRouteId(s.routeId);
    setStopName(s.name);
    setPickupTime(s.time);
    setFormOpen(true);
  };

  const submit = () => {
    if (!routeId || !stopName.trim() || !pickupTime.trim()) return;
    if (editingId) updateStopOnRoute(routeId, editingId, { name: stopName.trim(), time: pickupTime.trim() });
    else addStopToRoute(routeId, { name: stopName.trim(), time: pickupTime.trim() });
    setFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bus Stops</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stops and pickup times for each route.</p>
          </div>
          <button type="button" onClick={openCreate} className="px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2">
            <Plus size={18} />
            Add Stop
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
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stop or route..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={routeId}
            onChange={e => setRouteId(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.routeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {allStops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16">
                    <SkeletonRow />
                  </td>
                </tr>
              ) : (
                allStops.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{s.routeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{s.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s.id)}
                          className="px-3 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteStopFromRoute(s.routeId, s.id)}
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
        title={editingId ? 'Edit Stop' : 'Add Stop'}
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
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Route</label>
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
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Stop Name</label>
              <input
                value={stopName}
                onChange={e => setStopName(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Pickup Time</label>
              <input
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
                placeholder="e.g. 07:45 AM"
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusStops;

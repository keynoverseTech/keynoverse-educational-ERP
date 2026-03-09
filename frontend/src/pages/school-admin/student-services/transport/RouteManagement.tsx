import React, { useMemo, useState } from 'react';
import { Clock, Edit3, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';
import { Modal, SkeletonRow, StatusPill, TransportSubnav } from './TransportShared';

const RouteManagement: React.FC = () => {
  const { routes, vehicles, addRoute, updateRoute, deleteRoute } = useTransport();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [routeName, setRouteName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return routes.filter(r => `${r.routeName} ${r.description ?? ''}`.toLowerCase().includes(q));
  }, [routes, search]);

  const busesAssigned = (routeId: string) => vehicles.filter(v => v.routeId === routeId).length;

  const openCreate = () => {
    setEditingId(null);
    setRouteName('');
    setDescription('');
    setEstimatedTime('');
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const r = routes.find(x => x.id === id);
    if (!r) return;
    setEditingId(r.id);
    setRouteName(r.routeName);
    setDescription(r.description ?? '');
    setEstimatedTime(r.estimatedTime ?? '');
    setFormOpen(true);
  };

  const submit = () => {
    if (!routeName.trim()) return;
    if (editingId) updateRoute(editingId, { routeName: routeName.trim(), description, estimatedTime });
    else addRoute({ routeName: routeName.trim(), description, totalStops: 0, estimatedTime, stops: [], fare: 0, capacity: 0, status: 'Active' });
    setFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Route Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage transport routes and metadata.</p>
          </div>
          <button type="button" onClick={openCreate} className="px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2">
            <Plus size={18} />
            Create Route
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
            placeholder="Search route name or description..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <SkeletonRow />
          </div>
        ) : (
          filtered.map(route => (
            <div key={route.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{route.routeName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{route.description ?? 'No description'}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <StatusPill label={`${route.totalStops} stops`} tone="gray" />
                      {route.estimatedTime ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                          <Clock size={12} /> {route.estimatedTime}
                        </span>
                      ) : null}
                      <StatusPill label={`${busesAssigned(route.id)} buses`} tone="blue" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(route.id)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRoute(route.id)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/30">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin size={14} />
                  Route Stops &amp; Schedule
                </h4>
                <div className="space-y-3">
                  {route.stops.map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{s.time}</span>
                    </div>
                  ))}
                  {route.stops.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">No stops configured.</p> : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        title={editingId ? 'Edit Route' : 'Create Route'}
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
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Route Name</label>
            <input
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Estimated Travel Time</label>
            <input
              value={estimatedTime}
              onChange={e => setEstimatedTime(e.target.value)}
              placeholder="e.g. 45 mins"
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RouteManagement;

import React, { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentTransport } from '../../../../state/studentTransportContext';
import { Modal, SkeletonRow, StatusPill, ToastViewport, TransportSubnav } from './StudentTransportShared';

const StudentAvailableRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { ready, toasts, dismissToast, eligibleRoutes, getStopsForRoute, getRouteAvailableSeats, getRouteTotalSeats } = useStudentTransport();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return eligibleRoutes.filter(r => r.routeName.toLowerCase().includes(q));
  }, [eligibleRoutes, search]);

  const activeStops = useMemo(() => {
    if (!activeRouteId) return [];
    return getStopsForRoute(activeRouteId);
  }, [activeRouteId, getStopsForRoute]);

  const openStops = (routeId: string) => {
    setActiveRouteId(routeId);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Routes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Routes with available seats you can apply for.</p>
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
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search route name..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!ready ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </>
        ) : filtered.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
            <p className="font-bold text-gray-900 dark:text-white">No routes available</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try a different keyword or check later.</p>
          </div>
        ) : (
          filtered.map(r => {
            const totalStops = getStopsForRoute(r.id).length;
            const totalSeats = getRouteTotalSeats(r.id);
            const availableSeats = getRouteAvailableSeats(r.id);
            const tone = availableSeats === 0 ? 'red' : availableSeats <= Math.ceil(totalSeats * 0.2) ? 'amber' : 'green';
            return (
              <div key={r.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{r.routeName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.estimatedTime}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <StatusPill label={`${totalStops} stops`} tone="gray" />
                      <StatusPill label={`${availableSeats} seats`} tone={tone as any} />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <MapPin size={20} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => openStops(r.id)}
                    className="p-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
                  >
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      View Stops <ArrowRight size={16} className="text-gray-400" />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pickup times and options</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/student/services/transport/apply', { state: { routeId: r.id } })}
                    className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-left transition-colors"
                  >
                    <p className="text-sm font-bold flex items-center justify-between">
                      Apply <ArrowRight size={16} />
                    </p>
                    <p className="text-xs mt-1 opacity-90">Start application flow</p>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        title="Route Stops"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        widthClassName="max-w-3xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Close
            </button>
            {activeRouteId ? (
              <button
                type="button"
                onClick={() => navigate('/student/services/transport/apply', { state: { routeId: activeRouteId } })}
                className="px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply for this route
              </button>
            ) : null}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop Name</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Time</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : activeStops.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                    No stops configured for this route.
                  </td>
                </tr>
              ) : (
                activeStops.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{s.stopName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{s.pickupTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{typeof s.distanceKm === 'number' ? `${s.distanceKm} km` : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default StudentAvailableRoutes;


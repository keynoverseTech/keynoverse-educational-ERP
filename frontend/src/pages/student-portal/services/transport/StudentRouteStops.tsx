import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudentTransport } from '../../../../state/studentTransportContext';
import { SkeletonRow, ToastViewport, TransportSubnav } from './StudentTransportShared';

const StudentRouteStops: React.FC = () => {
  const navigate = useNavigate();
  const { routeId } = useParams<{ routeId: string }>();
  const { ready, toasts, dismissToast, routes, getStopsForRoute } = useStudentTransport();

  const route = useMemo(() => routes.find(r => r.id === routeId) ?? null, [routeId, routes]);
  const stops = useMemo(() => (routeId ? getStopsForRoute(routeId) : []), [getStopsForRoute, routeId]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{route ? route.routeName : 'Route Stops'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Pick-up stops and times.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/services/transport/available')}
            className="px-4 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
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

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : stops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    No stops configured.
                  </td>
                </tr>
              ) : (
                stops.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{s.stopName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{s.pickupTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{typeof s.distanceKm === 'number' ? `${s.distanceKm} km` : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      {routeId ? (
                        <button
                          type="button"
                          onClick={() => navigate('/student/services/transport/apply', { state: { routeId, stopId: s.id } })}
                          className="px-3 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Select Stop
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {routeId ? (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/student/services/transport/apply', { state: { routeId } })}
            className="px-5 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply for this route
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default StudentRouteStops;

import React, { useMemo } from 'react';
import { ArrowRight, Bus, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentTransport } from '../../../../state/studentTransportContext';
import { StatusPill, ToastViewport, TransportSubnav } from './StudentTransportShared';

const StudentMyTransport: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, dismissToast, routes, buses, getStopsForRoute, getMyActiveAllocation } = useStudentTransport();

  const allocation = useMemo(() => getMyActiveAllocation(), [getMyActiveAllocation]);
  const route = allocation ? routes.find(r => r.id === allocation.routeId) ?? null : null;
  const bus = allocation ? buses.find(b => b.id === allocation.busId) ?? null : null;
  const stop = allocation ? getStopsForRoute(allocation.routeId).find(s => s.id === allocation.stopId) ?? null : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Transport</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your current transport allocation and pickup details.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/services/transport/apply')}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-2"
          >
            Apply <ArrowRight size={18} />
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

      {!allocation ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto text-gray-500 dark:text-gray-300">
            <Bus size={26} />
          </div>
          <p className="mt-4 font-bold text-gray-900 dark:text-white">No active transport allocation</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Apply for transport to get allocated to a route.</p>
          <button
            type="button"
            onClick={() => navigate('/student/services/transport/apply')}
            className="mt-5 px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
          >
            Apply for Transport
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</p>
                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{bus?.busNumber ?? 'Bus'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{route?.routeName ?? 'Route'} • {route?.estimatedTime ?? '—'}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusPill label={allocation.status} tone={allocation.status === 'Active' ? 'green' : 'gray'} />
                  {stop ? <StatusPill label={stop.stopName} tone="blue" /> : null}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <MapPin size={22} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{stop?.stopName ?? '—'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Time</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{stop?.pickupTime ?? allocation.pickupTime}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{allocation.semester}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Next Pickup</p>
                <div className="mt-2 flex items-center gap-2">
                  <Navigation size={16} className="text-gray-400" />
                  <span className="font-bold text-gray-900 dark:text-white">{stop?.pickupTime ?? allocation.pickupTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="font-bold text-gray-900 dark:text-white">Actions</p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/student/services/transport/history')}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
              >
                <p className="font-bold text-gray-900 dark:text-white">Transport History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">See your applications and statuses</p>
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/services/transport/available')}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
              >
                <p className="font-bold text-gray-900 dark:text-white">Available Routes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check routes and pickup stops</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMyTransport;


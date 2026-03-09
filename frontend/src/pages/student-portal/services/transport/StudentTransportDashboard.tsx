import React, { useMemo } from 'react';
import { ArrowRight, Bus, MapPin, Navigation, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentTransport } from '../../../../state/studentTransportContext';
import { SkeletonCard, StatusPill, ToastViewport, TransportSubnav } from './StudentTransportShared';

const StudentTransportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ready, toasts, dismissToast, currentStudent, routes, buses, getMyActiveAllocation, getMyLatestApplication, getStopsForRoute } = useStudentTransport();

  const allocation = useMemo(() => getMyActiveAllocation(), [getMyActiveAllocation]);
  const latestApplication = useMemo(() => getMyLatestApplication(), [getMyLatestApplication]);

  const route = allocation ? routes.find(r => r.id === allocation.routeId) ?? null : null;
  const bus = allocation ? buses.find(b => b.id === allocation.busId) ?? null : null;

  const nextStop = useMemo(() => {
    if (!allocation) return null;
    const stop = getStopsForRoute(allocation.routeId).find(s => s.id === allocation.stopId) ?? null;
    return stop ? { stopName: stop.stopName, pickupTime: stop.pickupTime } : { stopName: '—', pickupTime: allocation.pickupTime };
  }, [allocation, getStopsForRoute]);

  const statusLabel = allocation?.status === 'Active' ? 'Active' : latestApplication?.status ?? 'None';
  const statusTone =
    statusLabel === 'Active' || statusLabel === 'Approved'
      ? 'green'
      : statusLabel === 'Pending'
        ? 'amber'
        : statusLabel === 'Rejected'
          ? 'red'
          : 'gray';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transportation</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Apply for transport, see your allocation, and track your history.</p>
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

      {!currentStudent ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 flex items-center justify-center">
              <ShieldAlert size={22} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">No student profile loaded</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Mock data is not ready.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!ready ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">My Bus</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{bus ? bus.busNumber : 'Not allocated'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bus ? `${bus.capacity} seats` : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                  <Bus size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">My Route</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{route ? route.routeName : '—'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{route ? route.estimatedTime : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next Pickup Stop</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{nextStop?.stopName ?? '—'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{nextStop?.pickupTime ?? '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                  <Navigation size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Transport Status</p>
                  <div className="mt-2">
                    <StatusPill label={statusLabel} tone={statusTone} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{latestApplication ? latestApplication.createdAt.slice(0, 10) : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200">
                  <ShieldAlert size={20} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentTransportDashboard;


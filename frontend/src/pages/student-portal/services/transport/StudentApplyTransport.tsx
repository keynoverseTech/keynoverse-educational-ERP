import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudentTransport } from '../../../../state/studentTransportContext';
import { Modal, StatusPill, Stepper, ToastViewport, TransportSubnav } from './StudentTransportShared';

type LocationState = { routeId?: string; stopId?: string } | null;

const DEFAULT_SEMESTER = '2025/2026 • Second';

const StudentApplyTransport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preset = (location.state as LocationState) ?? null;

  const { ready, toasts, dismissToast, currentStudent, eligibleRoutes, getStopsForRoute, getRouteAvailableSeats, createApplication } = useStudentTransport();

  const initialStep = preset?.routeId ? (preset?.stopId ? 3 : 2) : 1;
  const [step, setStep] = useState<1 | 2 | 3>(initialStep as 1 | 2 | 3);
  const [search, setSearch] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(preset?.routeId ?? null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(preset?.stopId ?? null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const filteredRoutes = useMemo(() => {
    const q = search.toLowerCase();
    return eligibleRoutes.filter(r => r.routeName.toLowerCase().includes(q));
  }, [eligibleRoutes, search]);

  const selectedRoute = useMemo(() => eligibleRoutes.find(r => r.id === selectedRouteId) ?? null, [eligibleRoutes, selectedRouteId]);
  const stops = useMemo(() => (selectedRouteId ? getStopsForRoute(selectedRouteId) : []), [getStopsForRoute, selectedRouteId]);
  const selectedStop = useMemo(() => stops.find(s => s.id === selectedStopId) ?? null, [selectedStopId, stops]);

  const canContinue1 = Boolean(selectedRouteId);
  const canContinue2 = Boolean(selectedStopId);

  const submit = () => {
    if (!selectedRouteId || !selectedStopId) return;
    const created = createApplication({ routeId: selectedRouteId, stopId: selectedStopId, semester: DEFAULT_SEMESTER });
    if (created) {
      setCreatedId(created.id);
      setConfirmOpen(false);
    }
  };

  const restart = () => {
    setCreatedId(null);
    setStep(1);
    setSelectedRouteId(null);
    setSelectedStopId(null);
    setSearch('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Transport</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Complete a 3-step application.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/services/transport')}
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

      <Stepper step={step} />

      {createdId ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <p className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Application Submitted</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your request is pending approval.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/student/services/transport/my-transport')}
              className="px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
            >
              View My Transport
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/services/transport/history')}
              className="px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
            >
              Transport History
            </button>
            <button
              type="button"
              onClick={restart}
              className="px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              New Application
            </button>
          </div>
        </div>
      ) : (
        <>
          {step === 1 ? (
            <div className="space-y-4">
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
                      <div key={i} className="h-36 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    ))}
                  </>
                ) : filteredRoutes.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                    <p className="font-bold text-gray-900 dark:text-white">No routes available</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Routes must have seats and match your level.</p>
                  </div>
                ) : (
                  filteredRoutes.map(r => {
                    const selected = selectedRouteId === r.id;
                    const availableSeats = getRouteAvailableSeats(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRouteId(r.id);
                          setSelectedStopId(null);
                        }}
                        className={`text-left bg-white dark:bg-gray-800 rounded-2xl border p-6 transition-colors ${
                          selected
                            ? 'border-blue-600 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{r.routeName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.estimatedTime}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <StatusPill label={`${availableSeats} seats`} tone={availableSeats > 0 ? 'green' : 'red'} />
                              {currentStudent ? <StatusPill label={`Level ${currentStudent.level}`} tone="blue" /> : null}
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                            <MapPin size={20} />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  disabled={!canContinue1}
                  onClick={() => canContinue1 && setStep(2)}
                  className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${
                    canContinue1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selected Route</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedRoute?.routeName ?? '—'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Change
                  </button>
                </div>
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
                      {stops.map(s => {
                        const selected = selectedStopId === s.id;
                        return (
                          <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{s.stopName}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{s.pickupTime}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{typeof s.distanceKm === 'number' ? `${s.distanceKm} km` : '—'}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedStopId(s.id)}
                                className={`px-3 py-2 rounded-xl text-sm font-bold ${
                                  selected ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {selected ? 'Selected' : 'Select Stop'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {stops.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            No stops configured for this route.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canContinue2}
                  onClick={() => canContinue2 && setStep(3)}
                  className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${
                    canContinue2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <p className="font-bold text-gray-900 dark:text-white">Application Confirmation</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review details before confirming.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selected Route</p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">{selectedRoute?.routeName ?? '—'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedRoute?.estimatedTime ?? '—'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selected Stop</p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">{selectedStop?.stopName ?? '—'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Pickup: {selectedStop?.pickupTime ?? '—'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester Duration</p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{DEFAULT_SEMESTER}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusPill label="Pending" tone="amber" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">After confirmation</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    className="px-5 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Confirm Application <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <Modal
        title="Confirm Application"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        widthClassName="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button type="button" onClick={submit} className="px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">
              Confirm
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Route: <span className="font-bold">{selectedRoute?.routeName ?? '—'}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Stop: <span className="font-bold">{selectedStop?.stopName ?? '—'}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Pickup: <span className="font-bold">{selectedStop?.pickupTime ?? '—'}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Semester: <span className="font-bold">{DEFAULT_SEMESTER}</span>
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your application will be marked as Pending.</p>
        </div>
      </Modal>
    </div>
  );
};

export default StudentApplyTransport;

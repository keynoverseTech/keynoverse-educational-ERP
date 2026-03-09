import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BedDouble, Building2, CheckCircle2, Search, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudentHostel } from '../../../../state/studentHostelContext';
import { HostelSubnav, Modal, StatusPill, Stepper, ToastViewport } from './StudentHostelShared';

type LocationState = { hostelId?: string; roomId?: string } | null;

const DEFAULT_SEMESTER_START = '2025/2026 • Second';
const DEFAULT_SEMESTER_END = '2026/2027 • First';

const StudentBookHostel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preset = (location.state as LocationState) ?? null;

  const {
    ready,
    toasts,
    dismissToast,
    currentStudent,
    isEligible,
    eligibleHostels,
    getAvailableBedsForHostel,
    getRoomsForHostel,
    getRoom,
    createBooking,
  } = useStudentHostel();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [search, setSearch] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(preset?.hostelId ?? null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(preset?.roomId ?? null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const selectedHostel = useMemo(() => eligibleHostels.find(h => h.id === selectedHostelId) ?? null, [eligibleHostels, selectedHostelId]);
  const selectedRoom = useMemo(() => (selectedRoomId ? getRoom(selectedRoomId) : null), [getRoom, selectedRoomId]);

  const roomsForSelectedHostel = useMemo(() => {
    if (!selectedHostelId) return [];
    return getRoomsForHostel(selectedHostelId).map(r => ({
      room: r,
      availableBeds: Math.max(0, r.bedCapacity - r.occupiedBeds),
    }));
  }, [getRoomsForHostel, selectedHostelId]);

  const filteredHostels = useMemo(() => {
    return eligibleHostels.filter(h => h.hostelName.toLowerCase().includes(search.toLowerCase()));
  }, [eligibleHostels, search]);

  const previewBedSpace = useMemo(() => {
    if (!selectedRoom) return '—';
    return `B${Math.min(selectedRoom.bedCapacity, selectedRoom.occupiedBeds + 1)}`;
  }, [selectedRoom]);

  const canContinueFromStep1 = Boolean(selectedHostelId);
  const canContinueFromStep2 = Boolean(selectedRoomId) && Boolean(selectedHostelId);

  const continueFromStep1 = () => {
    if (!selectedHostelId) return;
    setStep(2);
  };

  const continueFromStep2 = () => {
    if (!selectedRoomId) return;
    setStep(3);
  };

  const confirmBooking = () => {
    if (!selectedHostelId || !selectedRoomId) return;
    const created = createBooking({
      hostelId: selectedHostelId,
      roomId: selectedRoomId,
      semesterStart: DEFAULT_SEMESTER_START,
      semesterEnd: DEFAULT_SEMESTER_END,
    });
    if (created) {
      setCreatedBookingId(created.id);
      setConfirmOpen(false);
    }
  };

  const openConfirm = () => {
    if (!canContinueFromStep2) return;
    setConfirmOpen(true);
  };

  const startOver = () => {
    setCreatedBookingId(null);
    setStep(1);
    setSelectedHostelId(null);
    setSelectedRoomId(null);
    setSearch('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Hostel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Complete a simple 3-step booking flow.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/services/hostel')}
            className="px-4 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <HostelSubnav
          items={[
            { label: 'Dashboard', to: '/student/services/hostel' },
            { label: 'Available Hostels', to: '/student/services/hostel/available' },
            { label: 'Book Hostel', to: '/student/services/hostel/book' },
            { label: 'My Hostel', to: '/student/services/hostel/my-hostel' },
            { label: 'Booking History', to: '/student/services/hostel/history' },
          ]}
        />
      </div>

      {!isEligible ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="font-bold text-gray-900 dark:text-white">You are not eligible to book a hostel</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">If you believe this is incorrect, contact your school admin.</p>
          <div className="mt-3 flex items-center gap-2">
            {currentStudent ? <StatusPill label={`Level ${currentStudent.level}`} tone="blue" /> : null}
            {currentStudent ? <StatusPill label={currentStudent.gender} tone={currentStudent.gender === 'Male' ? 'blue' : 'purple'} /> : null}
          </div>
        </div>
      ) : null}

      <Stepper step={step} />

      {createdBookingId ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <p className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Booking Submitted</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your booking request has been submitted and is pending approval.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/student/services/hostel/my-hostel')}
              className="px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
            >
              View My Hostel
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/services/hostel/history')}
              className="px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
            >
              Booking History
            </button>
            <button
              type="button"
              onClick={startOver}
              className="px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              New Booking
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
                    placeholder="Search hostel name..."
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
                ) : filteredHostels.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                    <p className="font-bold text-gray-900 dark:text-white">No hostels found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try a different search keyword.</p>
                  </div>
                ) : (
                  filteredHostels.map(h => {
                    const availableBeds = getAvailableBedsForHostel(h.id);
                    const selected = selectedHostelId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          setSelectedHostelId(h.id);
                          setSelectedRoomId(null);
                        }}
                        className={`text-left bg-white dark:bg-gray-800 rounded-2xl border p-6 transition-colors ${
                          selected
                            ? 'border-blue-600 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{h.hostelName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{h.description}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <StatusPill label={h.gender} tone={h.gender === 'Male' ? 'blue' : 'purple'} />
                              <StatusPill label={`${availableBeds} beds`} tone={availableBeds > 0 ? 'green' : 'red'} />
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                            <Building2 size={20} />
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
                  disabled={!canContinueFromStep1}
                  onClick={continueFromStep1}
                  className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${
                    canContinueFromStep1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selected Hostel</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedHostel?.hostelName ?? '—'}</p>
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
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Number</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Beds</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {roomsForSelectedHostel.map(({ room, availableBeds }) => {
                        const selected = selectedRoomId === room.id;
                        return (
                          <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{room.roomNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{room.bedCapacity}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{availableBeds}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{room.roomType}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                disabled={availableBeds <= 0}
                                onClick={() => setSelectedRoomId(room.id)}
                                className={`px-3 py-2 rounded-xl text-sm font-bold ${
                                  availableBeds <= 0
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    : selected
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {availableBeds <= 0 ? 'Full' : selected ? 'Selected' : 'Select'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {roomsForSelectedHostel.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            No rooms available for this hostel.
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
                  disabled={!canContinueFromStep2}
                  onClick={continueFromStep2}
                  className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${
                    canContinueFromStep2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
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
                <p className="font-bold text-gray-900 dark:text-white">Booking Confirmation</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review details before confirming.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hostel</p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">{selectedHostel?.hostelName ?? '—'}</p>
                    {selectedHostel ? <div className="mt-2"><StatusPill label={selectedHostel.gender} tone={selectedHostel.gender === 'Male' ? 'blue' : 'purple'} /></div> : null}
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">{selectedRoom?.roomNumber ?? '—'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedRoom ? `${selectedRoom.roomType} • ${selectedRoom.bedCapacity} beds` : ''}</p>
                    <div className="mt-2">
                      <StatusPill label={`Bed Space: ${previewBedSpace}`} tone="green" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation Duration</p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{DEFAULT_SEMESTER_START} → {DEFAULT_SEMESTER_END}</p>
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
                    onClick={openConfirm}
                    className="px-5 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Confirm Booking <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <Modal
        title="Confirm Booking"
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
            <button type="button" onClick={confirmBooking} className="px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">
              Confirm
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <BedDouble size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Submit this booking request?</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">You can view it in Booking History after confirmation.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Hostel: <span className="font-bold">{selectedHostel?.hostelName ?? '—'}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Room: <span className="font-bold">{selectedRoom?.roomNumber ?? '—'}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Bed Space: <span className="font-bold">{previewBedSpace}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              Duration: <span className="font-bold">{DEFAULT_SEMESTER_START} → {DEFAULT_SEMESTER_END}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <XCircle size={16} className="text-gray-400" />
            <span>If you are unsure, you can cancel and change selections.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentBookHostel;


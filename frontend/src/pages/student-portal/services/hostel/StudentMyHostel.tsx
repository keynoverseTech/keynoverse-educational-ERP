import React, { useMemo } from 'react';
import { ArrowRight, Building2, DoorOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentHostel } from '../../../../state/studentHostelContext';
import { HostelSubnav, StatusPill, ToastViewport } from './StudentHostelShared';

const StudentMyHostel: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, dismissToast, currentStudent, allocations, hostels, rooms } = useStudentHostel();

  const hostelById = useMemo(() => new Map(hostels.map(h => [h.id, h])), [hostels]);
  const roomById = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

  const active = useMemo(() => {
    if (!currentStudent) return null;
    return allocations.find(a => a.studentId === currentStudent.id && a.status === 'Active') ?? null;
  }, [allocations, currentStudent]);

  const hostel = active ? hostelById.get(active.hostelId) ?? null : null;
  const room = active ? roomById.get(active.roomId) ?? null : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Hostel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your current hostel allocation and status.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/services/hostel/book')}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-2"
          >
            Book Hostel <ArrowRight size={18} />
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

      {!active ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto text-gray-500 dark:text-gray-300">
            <Building2 size={26} />
          </div>
          <p className="mt-4 font-bold text-gray-900 dark:text-white">No active hostel allocation</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start a booking to request a bed space.</p>
          <button
            type="button"
            onClick={() => navigate('/student/services/hostel/book')}
            className="mt-5 px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
          >
            Book Hostel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</p>
                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{hostel?.hostelName ?? 'Hostel'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Room {room?.roomNumber ?? '—'} • Bed Space {active.bedSpace}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusPill label={active.status} tone={active.status === 'Active' ? 'green' : 'amber'} />
                  {hostel ? <StatusPill label={hostel.gender} tone={hostel.gender === 'Male' ? 'blue' : 'purple'} /> : null}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <DoorOpen size={22} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Semester</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{active.semesterStart}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Semester</p>
                <p className="mt-2 font-bold text-gray-900 dark:text-white">{active.semesterEnd}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="font-bold text-gray-900 dark:text-white">Actions</p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/student/services/hostel/history')}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
              >
                <p className="font-bold text-gray-900 dark:text-white">Booking History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">See your past bookings and statuses</p>
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/services/hostel/available')}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
              >
                <p className="font-bold text-gray-900 dark:text-white">Available Hostels</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check availability by hostel and room</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMyHostel;


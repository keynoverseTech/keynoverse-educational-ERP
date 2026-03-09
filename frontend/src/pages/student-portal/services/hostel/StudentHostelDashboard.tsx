import React, { useMemo } from 'react';
import { ArrowRight, BedDouble, Building2, Calendar, ClipboardList, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentHostel } from '../../../../state/studentHostelContext';
import { HostelSubnav, SkeletonCard, StatusPill, ToastViewport } from './StudentHostelShared';

const StudentHostelDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ready, toasts, dismissToast, currentStudent, isEligible, activeRule, eligibleHostels, rooms, allocations, bookings, getAvailableBedsForHostel } =
    useStudentHostel();

  const myActiveAllocation = useMemo(() => {
    if (!currentStudent) return null;
    return allocations.find(a => a.studentId === currentStudent.id && a.status === 'Active') ?? null;
  }, [allocations, currentStudent]);

  const latestBooking = useMemo(() => {
    if (!currentStudent) return null;
    return bookings.find(b => b.studentId === currentStudent.id) ?? null;
  }, [bookings, currentStudent]);

  const availableBeds = useMemo(() => {
    return eligibleHostels.reduce((sum, h) => sum + getAvailableBedsForHostel(h.id), 0);
  }, [eligibleHostels, getAvailableBedsForHostel]);

  const totalEligibleRooms = useMemo(() => {
    const set = new Set(eligibleHostels.map(h => h.id));
    return rooms.filter(r => set.has(r.hostelId)).length;
  }, [eligibleHostels, rooms]);

  const bookingStatusLabel = latestBooking ? latestBooking.status : myActiveAllocation ? 'Approved' : 'None';

  const bookingTone =
    bookingStatusLabel === 'Approved'
      ? 'green'
      : bookingStatusLabel === 'Pending'
        ? 'amber'
        : bookingStatusLabel === 'Rejected'
          ? 'red'
          : bookingStatusLabel === 'Expired'
            ? 'gray'
            : 'gray';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Check availability, book a bed space, and track your allocation.</p>
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

      {!isEligible ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 flex items-center justify-center">
              <ShieldAlert size={22} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">You are not eligible for hostel booking</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Current eligibility: {activeRule ? `Levels ${activeRule.eligibleLevels.join(', ')}` : 'Not configured'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {currentStudent ? <StatusPill label={`Level ${currentStudent.level}`} tone="blue" /> : null}
                {currentStudent ? <StatusPill label={currentStudent.gender} tone={currentStudent.gender === 'Male' ? 'blue' : 'purple'} /> : null}
              </div>
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
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">My Hostel</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{myActiveAllocation ? 'Allocated' : 'Not allocated'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {myActiveAllocation ? `${myActiveAllocation.semesterStart} → ${myActiveAllocation.semesterEnd}` : 'No active allocation'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Booking Status</p>
                  <div className="mt-2">
                    <StatusPill label={bookingStatusLabel} tone={bookingTone} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{latestBooking ? latestBooking.createdAt.slice(0, 10) : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200">
                  <ClipboardList size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next Allocation Change</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{myActiveAllocation ? myActiveAllocation.semesterEnd : '—'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{myActiveAllocation ? 'End of allocation period' : 'No allocation'}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available Beds</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{availableBeds}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{totalEligibleRooms} rooms in eligible hostels</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                  <BedDouble size={20} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Quick Links</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'View Available Hostels', desc: 'See eligible hostels and availability', to: '/student/services/hostel/available' },
              { label: 'Start Booking', desc: 'Step-by-step booking flow', to: '/student/services/hostel/book' },
              { label: 'My Hostel', desc: 'Current allocation and status', to: '/student/services/hostel/my-hostel' },
              { label: 'Booking History', desc: 'Past bookings and statuses', to: '/student/services/hostel/history' },
            ].map(item => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
              >
                <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Eligibility</h3>
          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rule</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                {activeRule ? `Eligible levels: ${activeRule.eligibleLevels.join(', ')}` : 'No active rule'}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">{activeRule ? `Duration: ${activeRule.allocationDurationSemesters} semesters` : ''}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentStudent ? <StatusPill label={`Level ${currentStudent.level}`} tone="blue" /> : null}
                {currentStudent ? <StatusPill label={currentStudent.gender} tone={currentStudent.gender === 'Male' ? 'blue' : 'purple'} /> : null}
                <StatusPill label={isEligible ? 'Eligible' : 'Not eligible'} tone={isEligible ? 'green' : 'amber'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHostelDashboard;


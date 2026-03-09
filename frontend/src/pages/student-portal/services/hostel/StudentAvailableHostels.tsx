import React, { useMemo, useState } from 'react';
import { ArrowRight, BedDouble, Building2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentHostel } from '../../../../state/studentHostelContext';
import { HostelSubnav, Modal, SkeletonRow, StatusPill, ToastViewport } from './StudentHostelShared';

const StudentAvailableHostels: React.FC = () => {
  const navigate = useNavigate();
  const { ready, toasts, dismissToast, currentStudent, isEligible, eligibleHostels, getAvailableBedsForHostel, getRoomsForHostel } = useStudentHostel();

  const [search, setSearch] = useState('');
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [activeHostelId, setActiveHostelId] = useState<string | null>(null);

  const filteredHostels = useMemo(() => {
    return eligibleHostels.filter(h => h.hostelName.toLowerCase().includes(search.toLowerCase()));
  }, [eligibleHostels, search]);

  const activeRooms = useMemo(() => {
    if (!activeHostelId) return [];
    return getRoomsForHostel(activeHostelId).map(r => ({
      room: r,
      availableBeds: Math.max(0, r.bedCapacity - r.occupiedBeds),
    }));
  }, [activeHostelId, getRoomsForHostel]);

  const openRooms = (hostelId: string) => {
    setActiveHostelId(hostelId);
    setRoomModalOpen(true);
  };

  const bookRoom = (hostelId: string, roomId: string) => {
    navigate('/student/services/hostel/book', { state: { hostelId, roomId } });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Hostels</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Hostels you are eligible to book based on current rules.</p>
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
          <p className="font-bold text-gray-900 dark:text-white">No eligible hostels</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Your current level is not eligible for booking.</p>
          <div className="mt-3 flex items-center gap-2">
            {currentStudent ? <StatusPill label={`Level ${currentStudent.level}`} tone="blue" /> : null}
            {currentStudent ? <StatusPill label={currentStudent.gender} tone={currentStudent.gender === 'Male' ? 'blue' : 'purple'} /> : null}
          </div>
        </div>
      ) : null}

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
              <div key={i} className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
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
            const totalRooms = getRoomsForHostel(h.id).length;
            return (
              <div key={h.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{h.hostelName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{h.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <StatusPill label={h.gender} tone={h.gender === 'Male' ? 'blue' : 'purple'} />
                      <StatusPill label={`${totalRooms} rooms`} tone="gray" />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <Building2 size={20} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Beds</p>
                      <BedDouble size={16} className="text-gray-400" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">{availableBeds}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRooms(h.id)}
                    className="p-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
                  >
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      View Rooms <ArrowRight size={16} className="text-gray-400" />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">See capacity and availability</p>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        title="Rooms"
        open={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        widthClassName="max-w-3xl"
        footer={
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setRoomModalOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Number</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Beds</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Type</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!ready ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : activeRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                    No rooms found for this hostel.
                  </td>
                </tr>
              ) : (
                activeRooms.map(({ room, availableBeds }) => (
                  <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{room.roomNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{room.bedCapacity}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{availableBeds}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{room.roomType}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={availableBeds <= 0 || !activeHostelId}
                        onClick={() => activeHostelId && bookRoom(activeHostelId, room.id)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold ${
                          availableBeds <= 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Book
                      </button>
                    </td>
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

export default StudentAvailableHostels;


import React, { useMemo } from 'react';
import { Building2, BedDouble, Users, ClipboardList, ArrowRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHostel } from '../../../../state/hostelContext';
import { HostelSubnav, SkeletonLine, ToastViewport } from './HostelShared';

const HostelDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ready, hostels, rooms, bookingRequests, allocations, toasts, dismissToast } = useHostel();

  const metrics = useMemo(() => {
    const totalBedSpaces = rooms.reduce((sum, r) => sum + r.bedCapacity, 0);
    const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    const pendingRequests = bookingRequests.filter(r => r.status === 'Pending').length;
    return {
      totalHostels: hostels.length,
      totalRooms: rooms.length,
      totalBedSpaces,
      occupiedBeds,
      pendingRequests,
      activeAllocations: allocations.filter(a => a.status === 'Active').length,
    };
  }, [allocations, bookingRequests, hostels.length, rooms]);

  const occupancyByHostel = useMemo(() => {
    return hostels.map(h => {
      const hostelRooms = rooms.filter(r => r.hostelId === h.id);
      const capacity = hostelRooms.reduce((sum, r) => sum + r.bedCapacity, 0);
      const occupied = hostelRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
      const ratio = capacity > 0 ? occupied / capacity : 0;
      return { hostel: h, capacity, occupied, ratio };
    });
  }, [hostels, rooms]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hostels, rooms, rules, booking requests, and allocations.</p>
        </div>
        <HostelSubnav
          items={[
            { label: 'Dashboard', to: '/school-admin/student-services/hostel' },
            { label: 'Hostels', to: '/school-admin/student-services/hostel/hostels' },
            { label: 'Rooms', to: '/school-admin/student-services/hostel/rooms' },
            { label: 'Allocation Rules', to: '/school-admin/student-services/hostel/rules' },
            { label: 'Booking Requests', to: '/school-admin/student-services/hostel/requests' },
            { label: 'Allocations', to: '/school-admin/student-services/hostel/allocations' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {ready ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Hostels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalHostels}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl">
                  <Building2 size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalRooms}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl">
                  <BedDouble size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Bed Spaces</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalBedSpaces}</p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 rounded-xl">
                  <Users size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Occupied Beds</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.occupiedBeds}</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded-xl">
                  <BarChart3 size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.pendingRequests}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl">
                  <ClipboardList size={20} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <SkeletonLine widthClassName="w-28" />
                  <SkeletonLine widthClassName="w-16" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Occupancy by Hostel</h3>
            <button
              type="button"
              onClick={() => navigate('/school-admin/student-services/hostel/rooms')}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Rooms <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {ready ? (
              occupancyByHostel.map(row => (
                <div key={row.hostel.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{row.hostel.hostelName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {row.occupied}/{row.capacity} occupied
                      </p>
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{Math.round(row.ratio * 100)}%</div>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        row.ratio >= 1 ? 'bg-red-600' : row.ratio >= 0.7 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.round(row.ratio * 100))}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <SkeletonLine widthClassName="w-48" />
                      <SkeletonLine widthClassName="w-10" />
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            {[
              { label: 'Create Hostel', desc: 'Add a new hostel building', to: '/school-admin/student-services/hostel/hostels' },
              { label: 'Manage Rooms', desc: 'Add rooms and capacity', to: '/school-admin/student-services/hostel/rooms' },
              { label: 'Allocation Rules', desc: 'Configure eligibility and duration', to: '/school-admin/student-services/hostel/rules' },
              { label: 'Booking Requests', desc: 'Approve and reject requests', to: '/school-admin/student-services/hostel/requests' },
              { label: 'Allocations', desc: 'View current allocations', to: '/school-admin/student-services/hostel/allocations' },
            ].map(item => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDashboard;

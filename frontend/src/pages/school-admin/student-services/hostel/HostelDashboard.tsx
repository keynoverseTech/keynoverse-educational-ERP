import React from 'react';
import { Home, Users, CheckCircle, AlertCircle, Building, Calendar, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingWindowCard from '../BookingWindowCard';
import { useHostel } from '../../../../state/hostelContext';

const HostelDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { blocks, requests, bookingWindows } = useHostel();

  // Calculate Stats
  const totalRooms = blocks.reduce((sum, block) => sum + block.totalRooms, 0);
  const totalCapacity = blocks.reduce((sum, block) => sum + block.totalCapacity, 0);
  
  const occupiedBeds = blocks.reduce((sum, block) => {
    return sum + block.rooms.reduce((rSum, room) => rSum + room.occupied, 0);
  }, 0);

  const availableBeds = totalCapacity - occupiedBeds;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  const activeWindow = bookingWindows.find(w => w.status === 'Active');

  const stats = [
    { label: 'Total Rooms', value: totalRooms.toString(), icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Occupied Beds', value: occupiedBeds.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Available Beds', value: availableBeds.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Requests', value: pendingRequests.toString(), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const quickActions = [
    { 
      label: 'Manage Rooms', 
      desc: 'Add blocks, rooms & beds', 
      icon: Building, 
      path: '/school-admin/student-services/hostel/rooms',
      color: 'bg-blue-500'
    },
    { 
      label: 'Allocations', 
      desc: 'Process student requests', 
      icon: ClipboardList, 
      path: '/school-admin/student-services/hostel/allocations',
      color: 'bg-green-500'
    },
    { 
      label: 'Configuration', 
      desc: 'Booking windows & rules', 
      icon: Calendar, 
      path: '/school-admin/student-services/hostel/config',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hostel allocations and booking windows.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-left group"
          >
            <div className={`p-3 rounded-lg ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{action.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} bg-opacity-20`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Room Allocation Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
             <p>Allocation Chart (Mock)</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Active Booking Window</h3>
          {activeWindow ? (
            <BookingWindowCard window={activeWindow} />
          ) : (
             <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center text-gray-500">
               <Calendar className="mx-auto mb-2 opacity-50" size={32} />
               <p>No active booking windows.</p>
               <button 
                 onClick={() => navigate('/school-admin/student-services/hostel/config')}
                 className="text-blue-600 text-sm mt-2 hover:underline"
               >
                 Configure Windows
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelDashboard;

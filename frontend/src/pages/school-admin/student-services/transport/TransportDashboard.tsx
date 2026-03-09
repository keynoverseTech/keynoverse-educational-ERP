import React, { useMemo } from 'react';
import { Bus, MapPin, Users, AlertCircle, FileText, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingWindowCard from '../BookingWindowCard';
import { useTransport } from '../../../../state/transportContext';
import { TransportSubnav } from './TransportShared';

const TransportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { routes, vehicles, bookingWindows, transportRequests, allocations } = useTransport();

  const activeWindow = bookingWindows.find(w => w.status === 'Active' || w.status === 'Upcoming');

  const totals = useMemo(() => {
    const totalStops = routes.reduce((sum, r) => sum + r.stops.length, 0);
    const totalStudentsUsingTransport = allocations.filter(a => a.status === 'Active').length;
    const pendingRequests = transportRequests.filter(r => r.status === 'Pending').length;
    return {
      totalBuses: vehicles.length,
      totalRoutes: routes.length,
      totalStops,
      totalStudentsUsingTransport,
      pendingRequests,
    };
  }, [allocations, routes, transportRequests, vehicles.length]);

  const stats = [
    { label: 'Total Buses', value: totals.totalBuses.toString(), icon: Bus, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Routes', value: totals.totalRoutes.toString(), icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Bus Stops', value: totals.totalStops.toString(), icon: Route, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Students Using Transport', value: totals.totalStudentsUsingTransport.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Requests', value: totals.pendingRequests.toString(), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const quickActions = [
    { label: 'Buses', desc: 'Manage buses', icon: Bus, path: '/school-admin/student-services/transport/buses', color: 'bg-green-500' },
    { label: 'Routes', desc: 'Manage routes', icon: Route, path: '/school-admin/student-services/transport/routes', color: 'bg-blue-500' },
    { label: 'Bus Stops', desc: 'Manage stops & times', icon: MapPin, path: '/school-admin/student-services/transport/stops', color: 'bg-purple-500' },
    { label: 'Requests', desc: 'Approve transport requests', icon: FileText, path: '/school-admin/student-services/transport/requests', color: 'bg-orange-500' }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage bus routes and student transportation bookings.</p>
        </div>
        <TransportSubnav
          items={[
            { label: 'Dashboard', to: '/school-admin/student-services/transport' },
            { label: 'Buses', to: '/school-admin/student-services/transport/buses' },
            { label: 'Routes', to: '/school-admin/student-services/transport/routes' },
            { label: 'Bus Stops', to: '/school-admin/student-services/transport/stops' },
            { label: 'Requests', to: '/school-admin/student-services/transport/requests' },
            { label: 'Allocations', to: '/school-admin/student-services/transport/allocations' },
          ]}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Route Utilization</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p>Route Chart (Mock)</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Booking Windows</h3>
          {activeWindow ? (
            <BookingWindowCard window={activeWindow} />
          ) : (
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center text-gray-500">
              <p>No active or upcoming windows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;

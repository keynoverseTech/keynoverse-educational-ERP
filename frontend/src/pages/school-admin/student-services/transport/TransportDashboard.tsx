import React from 'react';
import { Bus, MapPin, Users, AlertCircle, Settings, FileText, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingWindowCard from '../BookingWindowCard';
import { useTransport } from '../../../../state/transportContext';

const TransportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { routes, vehicles, subscriptions, bookingWindows } = useTransport();

  const activeWindow = bookingWindows.find(w => w.status === 'Active' || w.status === 'Upcoming');

  const stats = [
    { label: 'Active Routes', value: routes.length.toString(), icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Registered Students', value: subscriptions.filter(s => s.status === 'Active').length.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Buses', value: vehicles.filter(v => v.status === 'Active').length.toString(), icon: Bus, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Requests', value: subscriptions.filter(s => s.status === 'Pending Payment').length.toString(), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const quickActions = [
    { 
      label: 'Routes & Stops', 
      desc: 'Manage shuttle routes', 
      icon: Route, 
      path: '/school-admin/student-services/transport/routes',
      color: 'bg-blue-500'
    },
    { 
      label: 'Vehicles', 
      desc: 'Manage buses & drivers', 
      icon: Bus, 
      path: '/school-admin/student-services/transport/vehicles',
      color: 'bg-green-500'
    },
    { 
      label: 'Subscriptions', 
      desc: 'Student bus passes', 
      icon: FileText, 
      path: '/school-admin/student-services/transport/subscriptions',
      color: 'bg-orange-500'
    },
    { 
      label: 'Configuration', 
      desc: 'Booking windows', 
      icon: Settings, 
      path: '/school-admin/student-services/transport/config',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage bus routes and student transportation bookings.</p>
        </div>
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

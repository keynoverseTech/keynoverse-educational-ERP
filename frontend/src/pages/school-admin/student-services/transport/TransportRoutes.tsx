import React, { useState } from 'react';
import { MapPin, Plus, Clock, Edit, Trash2, X } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';

const TransportRoutes: React.FC = () => {
  const { routes, addRoute, deleteRoute } = useTransport();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCode, setNewRouteCode] = useState('');
  const [newRouteFare, setNewRouteFare] = useState(5000);
  const [newRouteCapacity, setNewRouteCapacity] = useState(40);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    addRoute({
      name: newRouteName,
      code: newRouteCode,
      stops: [], // Default empty stops for now
      fare: newRouteFare,
      capacity: newRouteCapacity,
      status: 'Active'
    });
    setIsModalOpen(false);
    // Reset
    setNewRouteName('');
    setNewRouteCode('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Routes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage bus routes, stops, and schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create New Route
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map(route => (
          <div key={route.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{route.code}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${route.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {route.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">{route.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteRoute(route.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Term Fee</p>
                  <p className="font-semibold text-gray-900 dark:text-white">₦{route.fare.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Assigned Bus</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{route.assignedBus || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/30">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} />
                Route Stops & Schedule
              </h4>
              <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-700">
                {route.stops.map((stop) => (
                  <div key={stop.id} className="relative flex items-center gap-4 pl-6">
                    <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 shadow-sm z-10"></div>
                    <div className="flex-1 flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{stop.name}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {stop.time}
                      </div>
                    </div>
                  </div>
                ))}
                {route.stops.length === 0 && (
                   <p className="text-sm text-gray-500 pl-6">No stops configured yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Create New Route</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Route Name</label>
                <input 
                  type="text" 
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. Campus Shuttle" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Route Code</label>
                <input 
                  type="text" 
                  required
                  value={newRouteCode}
                  onChange={(e) => setNewRouteCode(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. RT-005" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fare (₦)</label>
                    <input 
                      type="number" 
                      required
                      value={newRouteFare}
                      onChange={(e) => setNewRouteFare(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity</label>
                    <input 
                      type="number" 
                      required
                      value={newRouteCapacity}
                      onChange={(e) => setNewRouteCapacity(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                 </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportRoutes;

import React, { useState } from 'react';
import { Bus, User, Settings, X } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';

const TransportVehicles: React.FC = () => {
  const { vehicles, addVehicle, deleteVehicle } = useTransport();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newCapacity, setNewCapacity] = useState(30);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      plate: newPlate,
      model: newModel,
      driver: newDriver,
      capacity: newCapacity,
      status: 'Active'
    });
    setIsModalOpen(false);
    // Reset
    setNewPlate('');
    setNewModel('');
    setNewDriver('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Fleet</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage buses and drivers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Bus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Vehicle Info</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Driver</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Capacity</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {vehicles.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{bus.plate}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{bus.model}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={14} className="text-gray-500" />
                    </div>
                    <span className="text-gray-900 dark:text-white text-sm">{bus.driver}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{bus.capacity} Seats</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bus.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {bus.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-blue-600 mr-3">
                    <Settings size={18} />
                  </button>
                  <button onClick={() => deleteVehicle(bus.id)} className="text-gray-400 hover:text-red-600">
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Add New Vehicle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Plate Number</label>
                <input 
                  type="text" 
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. KJA-123-XY" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Model</label>
                <input 
                  type="text" 
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. Toyota Coaster" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Driver Name</label>
                <input 
                  type="text" 
                  required
                  value={newDriver}
                  onChange={(e) => setNewDriver(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. Mr. John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity</label>
                <input 
                  type="number" 
                  required
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportVehicles;

import { useState } from 'react';
import { MapPin, Users, Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Hall {
  id: string;
  name: string;
  capacity: number;
  location: string;
  type: 'Lecture Theatre' | 'Classroom' | 'Hall';
  status: 'Available' | 'Maintenance' | 'Booked';
}

const HallManagement = () => {
  const [halls] = useState<Hall[]>([
    { id: '1', name: 'ETF Hall', capacity: 750, location: 'Central Campus', type: 'Hall', status: 'Available' },
    { id: '2', name: 'Lecture Theatre B', capacity: 300, location: 'Faculty of Science', type: 'Lecture Theatre', status: 'Available' },
    { id: '3', name: 'Room 402', capacity: 80, location: 'Faculty of Arts', type: 'Classroom', status: 'Maintenance' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hall & Venue Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure exam venues and capacities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Venue
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search venues..." 
          className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{hall.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{hall.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                hall.status === 'Available' ? 'bg-green-100 text-green-700' :
                hall.status === 'Maintenance' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {hall.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Users size={16} />
                <span>Capacity: <strong>{hall.capacity}</strong> students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={16} />
                <span>{hall.location}</span>
              </div>
            </div>

            <div className="flex gap-2 border-t pt-4 dark:border-gray-700">
              <button className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex justify-center items-center gap-2">
                <Edit2 size={14} /> Edit
              </button>
              <button className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex justify-center items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Venue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hall Name</label>
                <input type="text" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 1000 Seater Hall" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                <input type="number" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. North Campus" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option>Lecture Theatre</option>
                  <option>Hall</option>
                  <option>Classroom</option>
                  <option>Lab</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Venue</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallManagement;

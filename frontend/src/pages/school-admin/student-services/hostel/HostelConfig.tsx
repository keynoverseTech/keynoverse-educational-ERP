import React, { useState } from 'react';
import { Save, Calendar, AlertTriangle } from 'lucide-react';
import { useHostel } from '../../../../state/hostelContext';

const HostelConfig: React.FC = () => {
  const { bookingWindows, updateBookingWindow } = useHostel();
  const activeWindow = bookingWindows[0]; // For simplicity, just using the first one as "Main" window

  const [formData, setFormData] = useState({
    description: activeWindow.description,
    startDate: activeWindow.startDate,
    endDate: activeWindow.endDate,
    targetGroup: activeWindow.targetGroup
  });

  const handleSave = () => {
    updateBookingWindow({
      ...activeWindow,
      ...formData
    });
    alert('Configuration saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Set up booking windows and rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Window Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Booking Windows
          </h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="text-blue-600 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">Active Window Status</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Booking is currently <strong>{activeWindow.status.toUpperCase()}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Window Title</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Open Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Close Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Target Group</label>
                <select 
                  value={formData.targetGroup}
                  onChange={(e) => setFormData({...formData, targetGroup: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>All Students</option>
                  <option>Freshers Only (100 Level)</option>
                  <option>Final Year Only</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleSave}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rules & Constraints</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
               <div>
                 <p className="font-medium text-gray-900 dark:text-white">Allow Gender Mixing in Blocks</p>
                 <p className="text-xs text-gray-500">If disabled, blocks are strictly Male or Female.</p>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
             </div>

             <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
               <div>
                 <p className="font-medium text-gray-900 dark:text-white">Auto-Approve Requests</p>
                 <p className="text-xs text-gray-500">Automatically approve if space is available.</p>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
             </div>

             <div className="flex items-center justify-between py-3">
               <div>
                 <p className="font-medium text-gray-900 dark:text-white">Enable Waitlist</p>
                 <p className="text-xs text-gray-500">Allow students to join waitlist when full.</p>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelConfig;

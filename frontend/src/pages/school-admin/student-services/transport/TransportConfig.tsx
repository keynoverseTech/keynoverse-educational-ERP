import React, { useState } from 'react';
import { Save, Calendar, AlertTriangle } from 'lucide-react';
import { useTransport } from '../../../../state/transportContext';

const TransportConfig: React.FC = () => {
  const { bookingWindows, updateBookingWindow } = useTransport();
  const activeWindow = bookingWindows[0]; // Assuming first one for now

  const [formData, setFormData] = useState({
    description: activeWindow.description,
    startDate: activeWindow.startDate,
    endDate: activeWindow.endDate
  });

  const handleSave = () => {
    updateBookingWindow({
      ...activeWindow,
      ...formData
    });
    alert('Transport configuration saved!');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Set up booking windows for bus passes.</p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Transport Booking Windows
          </h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="text-orange-600 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300">Window Status</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
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

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleSave}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default TransportConfig;

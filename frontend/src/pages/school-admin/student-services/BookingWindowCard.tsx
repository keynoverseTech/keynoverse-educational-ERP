import React from 'react';
import { Home, Calendar, Clock, AlertCircle } from 'lucide-react';

interface BookingWindow {
  id: string;
  type: 'Hostel' | 'Transport';
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Closed';
  description: string;
}

const BookingWindowCard: React.FC<{ window: BookingWindow }> = ({ window }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
            {window.type === 'Hostel' ? <Home size={20} /> : <AlertCircle size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{window.type} Booking</h3>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(window.status)}`}>
              {window.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Opens:</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{window.startDate}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>Closes:</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{window.endDate}</span>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
        {window.description}
      </p>
    </div>
  );
};

export default BookingWindowCard;

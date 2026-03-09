import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus 
} from 'lucide-react';

const DefenseScheduling: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  // Mock Data
  const defenses = [
    {
      id: 1,
      student: 'John Doe',
      project: 'AI in Healthcare Diagnostics',
      date: '2024-04-15',
      time: '10:00 AM',
      venue: 'Conference Hall A',
      panel: ['Prof. X', 'Dr. Y', 'Dr. Z'],
      status: 'Scheduled',
    },
    {
      id: 2,
      student: 'Jane Smith',
      project: 'Sustainable Urban Planning',
      date: '2024-04-16',
      time: '02:00 PM',
      venue: 'Room 305',
      panel: ['Prof. A', 'Dr. B'],
      status: 'Scheduled',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-orange-600" />
            Defense Scheduling
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule and manage project defense sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'calendar' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Calendar View
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus size={16} />
            Schedule Defense
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 grid grid-cols-1 gap-4">
            {defenses.map((defense) => (
              <div key={defense.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{defense.student}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      {defense.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">{defense.project}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {defense.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {defense.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {defense.venue}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end gap-2">
                  <div className="flex items-center -space-x-2">
                    {defense.panel.map((member, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300" title={member}>
                        {member.charAt(0)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      <Users size={12} />
                    </div>
                  </div>
                  <button className="text-xs font-bold text-orange-600 hover:underline">Edit Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Calendar View</h3>
          <p className="text-gray-500">Calendar integration would go here.</p>
        </div>
      )}
    </div>
  );
};

export default DefenseScheduling;
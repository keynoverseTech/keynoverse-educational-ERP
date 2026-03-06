import React, { useState } from 'react';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  description: string;
  status: 'Upcoming' | 'Past';
}

const StaffEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Events
  const EVENTS: Event[] = [
    {
      id: '1',
      title: 'Staff Meeting',
      date: '2025-11-20',
      time: '10:00 AM',
      venue: 'Conference Hall',
      category: 'Meeting',
      description: 'Monthly staff meeting to discuss academic progress and department updates.',
      status: 'Upcoming'
    },
    {
      id: '2',
      title: 'Annual Research Conference',
      date: '2025-12-05',
      time: '09:00 AM',
      venue: 'Main Auditorium',
      category: 'Conference',
      description: 'University-wide research conference showcasing latest findings.',
      status: 'Upcoming'
    },
    {
      id: '3',
      title: 'Faculty Workshop',
      date: '2025-10-15',
      time: '11:00 AM',
      venue: 'Faculty Board Room',
      category: 'Workshop',
      description: 'Workshop on new teaching methodologies and digital tools.',
      status: 'Past'
    }
  ];

  const filteredEvents = EVENTS.filter(event => {
    const matchesTab = event.status.toLowerCase() === activeTab;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Events
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Stay updated with upcoming meetings, workshops, and university events.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'past'
              ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Past Events
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 relative p-6 flex flex-col justify-end">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                {event.category}
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">{event.venue}</p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                {event.description}
              </p>
              
              <button className="w-full py-2 mt-2 text-sm font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Events Found</h3>
            <p className="text-gray-500 mt-2">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffEvents;

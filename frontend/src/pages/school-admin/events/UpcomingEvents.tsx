import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Download, Search, History, CalendarDays, Image as ImageIcon } from 'lucide-react';
import { useEvents } from '../../../state/eventsContext';
import type { Event } from '../../../state/eventsTypes';

const UpcomingEvents: React.FC = () => {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const isPast = new Date(event.endDate) < new Date();
    const matchesTab = activeTab === 'past' ? isPast : !isPast;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    return activeTab === 'past' 
      ? new Date(b.startDate).getTime() - new Date(a.startDate).getTime() 
      : new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handleDownloadCSV = () => {
    const headers = ['Title', 'Category', 'Start Date', 'End Date', 'Time', 'Venue', 'Audience', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredEvents.map(e => [
        `"${e.title}"`,
        `"${e.category}"`,
        e.startDate,
        e.endDate,
        e.time,
        `"${e.venue}"`,
        `"${e.targetAudience}"`,
        e.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_events_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and manage the school's event schedule.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center no-print">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'past'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <History className="w-4 h-4" />
              Past Events
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search events..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event: Event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 print-break-inside-avoid">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto relative bg-gray-100 dark:bg-gray-900">
                  {event.bannerUrl ? (
                    <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold rounded-lg text-gray-900 shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        event.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        event.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Date</div>
                        <div className="font-bold">{new Date(event.startDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Time</div>
                        <div className="font-bold">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Venue</div>
                        <div className="font-bold truncate max-w-[120px]" title={event.venue}>{event.venue}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Audience</div>
                        <div className="font-bold truncate max-w-[120px]" title={event.targetAudience}>{event.targetAudience}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Events Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or check back later.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-break-inside-avoid { break-inside: avoid; border: 1px solid #eee; box-shadow: none; margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
};

export default UpcomingEvents;

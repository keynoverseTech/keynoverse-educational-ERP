import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'lecture' | 'exam' | 'holiday' | 'deadline' | 'meeting';
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  description?: string;
  location?: string;
}

// --- Mock Data ---

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'First Semester Resumption', type: 'lecture', startDate: '2024-09-09', description: 'All students are expected to return to campus.' },
  { id: '2', title: 'Registration Deadline', type: 'deadline', startDate: '2024-09-23', description: 'Late registration penalties apply after this date.' },
  { id: '3', title: 'Independence Day', type: 'holiday', startDate: '2024-10-01' },
  { id: '4', title: 'Mid-Semester Tests', type: 'exam', startDate: '2024-10-21', endDate: '2024-10-25' },
  { id: '5', title: 'Faculty Board Meeting', type: 'meeting', startDate: '2024-11-05', location: 'Senate Chamber' },
  { id: '6', title: 'Christmas Break', type: 'holiday', startDate: '2024-12-20', endDate: '2025-01-05' },
];

export default function AcademicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent>>({});

  const eventTypes = [
    { value: 'lecture', label: 'Academic', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'exam', label: 'Examination', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: 'holiday', label: 'Holiday', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'deadline', label: 'Deadline', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { value: 'meeting', label: 'Meeting', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  ];

  const getEventTypeColor = (type: string) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700';
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Group events by month
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const date = new Date(event.startDate);
    const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEvent.id) {
      setEvents(events.map(ev => ev.id === currentEvent.id ? { ...ev, ...currentEvent } as CalendarEvent : ev));
    } else {
      setEvents([...events, { ...currentEvent, id: Math.random().toString(36).substr(2, 9) } as CalendarEvent]);
    }
    setIsModalOpen(false);
    setCurrentEvent({});
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-blue-600" />
            Academic Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage important dates and deadlines.</p>
        </div>
        <button 
          onClick={() => { setCurrentEvent({ type: 'lecture' }); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Event List */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                {monthYear}
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {monthEvents.map(event => (
                  <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-16 text-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {new Date(event.startDate).getDate()}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {event.title}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getEventTypeColor(event.type)}`}>
                              {eventTypes.find(t => t.value === event.type)?.label}
                            </span>
                          </div>
                          
                          {/* Actions (visible on hover) */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setCurrentEvent(event); setIsModalOpen(true); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {event.endDate && (
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              Ends: {formatDate(event.endDate)}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sortedEvents.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500">
              No events scheduled. Click "Add Event" to get started.
            </div>
          )}
        </div>

        {/* Sidebar / Summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Current Session</h3>
            <div className="text-3xl font-bold mb-1">2024/2025</div>
            <div className="text-blue-100 mb-6">First Semester</div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-t border-blue-400/30 pt-3">
                <span className="text-blue-100">Semester Starts</span>
                <span className="font-semibold">Sep 09, 2024</span>
              </div>
              <div className="flex justify-between text-sm border-t border-blue-400/30 pt-3">
                <span className="text-blue-100">Semester Ends</span>
                <span className="font-semibold">Dec 20, 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Event Types</h3>
            <div className="space-y-2">
              {eventTypes.map(type => (
                <div key={type.value} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${type.color.split(' ')[0]}`}></div>
                    <span className="text-gray-600 dark:text-gray-300">{type.label}</span>
                  </div>
                  <span className="text-gray-400 font-mono">
                    {events.filter(e => e.type === type.value).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {currentEvent.id ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={currentEvent.title || ''}
                  onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                <select 
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={currentEvent.type || 'lecture'}
                  onChange={e => setCurrentEvent({...currentEvent, type: e.target.value as any})}
                >
                  {eventTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={currentEvent.startDate || ''}
                    onChange={e => setCurrentEvent({...currentEvent, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date (Opt)</label>
                  <input 
                    type="date" 
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={currentEvent.endDate || ''}
                    onChange={e => setCurrentEvent({...currentEvent, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Main Auditorium"
                  value={currentEvent.location || ''}
                  onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  rows={3}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={currentEvent.description || ''}
                  onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {currentEvent.id ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useEvents } from '../../../state/eventsContext';
import { Link } from 'react-router-dom';

const EventsDashboard: React.FC = () => {
  const { events } = useEvents();
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const upcoming = events
      .filter(e => new Date(e.startDate) > new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    if (upcoming.length > 0) {
      setNextEvent(upcoming[0]);
    }
  }, [events]);

  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(`${nextEvent.startDate}T${nextEvent.time}`).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            Events Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Overview of upcoming school events and activities.
          </p>
        </div>
      </div>

      {nextEvent ? (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Next Upcoming Event
                </div>
                <h2 className="text-4xl font-black leading-tight">{nextEvent.title}</h2>
                <div className="flex flex-wrap gap-4 text-purple-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {new Date(nextEvent.startDate).toLocaleDateString()} at {nextEvent.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {nextEvent.venue}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {nextEvent.targetAudience}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[80px]">
                  <div className="text-3xl font-bold">{countdown.days}</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Days</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[80px]">
                  <div className="text-3xl font-bold">{countdown.hours}</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Hours</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[80px]">
                  <div className="text-3xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Mins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Upcoming Events</h3>
          <p className="text-gray-500 mt-2">Schedule a new event to see it here.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">View and manage all scheduled events.</p>
          <Link to="/school-admin/events/upcoming" className="flex items-center text-blue-600 font-bold text-sm hover:gap-2 transition-all">
            View Schedule <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Event Categories</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">Manage event types and classifications.</p>
          <Link to="/school-admin/events/categories" className="flex items-center text-emerald-600 font-bold text-sm hover:gap-2 transition-all">
            Manage Categories <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Event</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">Schedule a new event or activity.</p>
          <Link to="/school-admin/events/create" className="flex items-center text-amber-600 font-bold text-sm hover:gap-2 transition-all">
            Create Now <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;

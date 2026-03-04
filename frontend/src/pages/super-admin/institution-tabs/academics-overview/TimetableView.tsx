import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TimetableEvent } from './types';

interface Props {
  timetable: TimetableEvent[];
}

const TimetableView: React.FC<Props> = ({ timetable }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const getEventsForDay = (day: string) => {
    return timetable.filter(event => {
      const matchesDay = event.day === day;
      const matchesLevel = selectedLevel === 'All Levels' || `${event.level} Level` === selectedLevel;
      return matchesDay && matchesLevel;
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} /> 
            Academic Timetable
          </h2>
          <p className="text-sm text-gray-500 mt-1">Weekly schedule view for all active courses.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500">
                <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium px-2">Current Week</span>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500">
                <ChevronRight size={18} />
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option>All Levels</option>
            <option>100 Level</option>
            <option>200 Level</option>
            <option>300 Level</option>
            <option>400 Level</option>
        </select>
        <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Departments</option>
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
        </select>
      </div>

      {/* Weekly View Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {days.map((day, index) => (
            <div key={day} className="min-h-[300px] flex flex-col">
              {/* Day Header */}
              <div className={`p-4 text-center border-b border-gray-200 dark:border-gray-700 ${index === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-gray-50/50 dark:bg-gray-900/20'}`}>
                <h3 className="font-bold text-gray-900 dark:text-white">{day}</h3>
                <span className="text-xs text-gray-500">8 Classes</span>
              </div>
              
              {/* Events Container */}
              <div className="p-3 space-y-3 flex-1 bg-gray-50/30 dark:bg-gray-900/10">
                {getEventsForDay(day).map((event, idx) => (
                  <div 
                    key={event.id} 
                    className="group relative bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {event.courseCode}
                        </span>
                        <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Clock size={14} />
                        </button>
                    </div>
                    
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-2 pl-2 line-clamp-2">
                        {event.courseName}
                    </h4>
                    
                    <div className="space-y-1 pl-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={12} className="text-gray-400" /> 
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} className="text-gray-400" /> 
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={12} className="text-gray-400" /> 
                        <span>{event.lecturer}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getEventsForDay(day).length === 0 && (
                    <div className="h-full flex items-center justify-center p-8 opacity-40">
                        <div className="text-center">
                            <Calendar size={24} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-500">No classes</p>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableView;

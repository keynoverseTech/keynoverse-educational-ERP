import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

type TimetableEntry = {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  time: string;
  code: string;
  title: string;
  venue: string;
  type: 'Lecture' | 'Lab';
};

const TIMETABLE_ENTRIES: TimetableEntry[] = [
  { id: '1', day: 'Mon', time: '10:00 - 12:00', code: 'CSC 401', title: 'Advanced Software Engineering', venue: 'Lab 2', type: 'Lab' },
  { id: '2', day: 'Wed', time: '14:00 - 16:00', code: 'CSC 415', title: 'Distributed Systems', venue: 'LH A', type: 'Lecture' },
  { id: '3', day: 'Fri', time: '08:00 - 10:00', code: 'CSC 420', title: 'Computer Security', venue: 'LH C', type: 'Lecture' },
];

const TimetablePage: React.FC = () => {
  const [activeDay, setActiveDay] = useState<TimetableEntry['day']>('Mon');

  const filtered = useMemo(() => TIMETABLE_ENTRIES.filter((e) => e.day === activeDay).sort((a, b) => a.time.localeCompare(b.time)), [activeDay]);

  const days: TimetableEntry['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Timetable
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Weekly schedule and class venues.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex-1 ${
                activeDay === d ? 'bg-white dark:bg-gray-800 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((e) => (
            <div key={e.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${e.type === 'Lab' ? 'bg-purple-500' : 'bg-orange-500'}`} />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                    e.type === 'Lab' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {e.type}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{e.code}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{e.title}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <Clock size={20} className="text-gray-400" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold flex items-center gap-2"><Clock size={14} /> Time</span>
                  <span className="font-black text-gray-900 dark:text-white">{e.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold flex items-center gap-2"><MapPin size={14} /> Venue</span>
                  <span className="font-black text-gray-900 dark:text-white">{e.venue}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Classes</h3>
            <p className="text-sm text-gray-500">No timetable entries for {activeDay}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;


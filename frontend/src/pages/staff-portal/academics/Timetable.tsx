import React, { useMemo } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { getAssignedCourses } from './assignedCourses';

interface Lecture {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  venue: string;
  day: string;
  startTime: string;
  endTime: string;
  level: string;
  type: 'Lecture' | 'Practical' | 'Tutorial';
}

const Timetable: React.FC = () => {
  const assigned = useMemo(() => getAssignedCourses(), []);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Mock lectures - filtered for current lecturer
  const lectures: Lecture[] = [
    {
      id: '1',
      courseCode: assigned[0]?.code || 'CSC 301',
      courseTitle: assigned[0]?.title || 'Operating Systems',
      lecturer: 'Dr. Sarah Connor', // Matches logged in user
      venue: 'Lecture Theatre A',
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      level: '300',
      type: 'Lecture'
    },
    {
      id: '2',
      courseCode: assigned[1]?.code || 'CSC 305',
      courseTitle: assigned[1]?.title || 'Database Management',
      lecturer: 'Dr. Sarah Connor',
      venue: 'Computer Lab 2',
      day: 'Wednesday',
      startTime: '10:00',
      endTime: '12:00',
      level: '300',
      type: 'Practical'
    },
    {
      id: '3',
      courseCode: assigned[0]?.code || 'CSC 301',
      courseTitle: assigned[0]?.title || 'Operating Systems',
      lecturer: 'Dr. Sarah Connor',
      venue: 'Lecture Theatre A',
      day: 'Friday',
      startTime: '14:00',
      endTime: '16:00',
      level: '300',
      type: 'Tutorial'
    }
  ];

  const getLecturesForDay = (day: string) => {
    return lectures.filter(l => l.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          My Timetable
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Your weekly lecture schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map(day => (
          <div key={day} className="flex flex-col gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center font-bold text-gray-700 dark:text-gray-300 sticky top-0">
              {day}
            </div>
            <div className="flex flex-col gap-3 min-h-[200px]">
              {getLecturesForDay(day).length > 0 ? (
                getLecturesForDay(day).map(lecture => (
                  <div key={lecture.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {lecture.courseCode}
                      </span>
                      <span className="text-xs text-gray-500">{lecture.type}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {lecture.courseTitle}
                    </h3>
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} />
                        {lecture.startTime} - {lecture.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={12} />
                        {lecture.venue}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 text-sm italic">
                  No lectures
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;

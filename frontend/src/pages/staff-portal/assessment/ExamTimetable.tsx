import React, { useMemo, useState } from 'react';
import { Calendar, MapPin, Clock, Search, Filter } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

interface Exam {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  invigilators: string[];
}

const ExamTimetable: React.FC = () => {
  const assigned = useMemo(() => getAssignedCourses(), []);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock exams based on assigned courses
  const exams: Exam[] = [
    {
      id: '1',
      courseCode: assigned[0]?.code || 'CSC 301',
      courseTitle: assigned[0]?.title || 'Operating Systems',
      date: '2025-11-15',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Exam Hall 1',
      invigilators: ['Dr. Sarah Connor', 'Mr. John Doe']
    },
    {
      id: '2',
      courseCode: assigned[1]?.code || 'CSC 305',
      courseTitle: assigned[1]?.title || 'Database Management',
      date: '2025-11-18',
      startTime: '14:00',
      endTime: '17:00',
      venue: 'CBT Centre',
      invigilators: ['Dr. Sarah Connor', 'Mrs. Jane Smith']
    }
  ];

  const filteredExams = exams.filter(exam => 
    exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Exam Timetable
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule of upcoming examinations for your courses.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map(exam => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    {exam.courseCode}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-2 line-clamp-1">
                    {exam.courseTitle}
                  </h3>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 min-w-[60px]">
                  <span className="block text-xs text-gray-500 uppercase font-bold">
                    {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="block text-xl font-bold text-gray-900 dark:text-white">
                    {new Date(exam.date).getDate()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="text-gray-400" size={18} />
                <span>{exam.startTime} - {exam.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="text-gray-400" size={18} />
                <span>{exam.venue}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Invigilators</p>
                <div className="flex flex-wrap gap-2">
                  {exam.invigilators.map((inv, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                      {inv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredExams.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p>No exams found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTimetable;

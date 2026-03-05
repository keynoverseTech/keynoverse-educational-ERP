import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { getEnrolledCourses } from '../academics/enrollments';

const buildExamSlots = () => {
  const enrolled = getEnrolledCourses().filter(c => c.status !== 'Pending');
  // Simple deterministic mapping of courses to exam slots for demo
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 7); // start next week
  return enrolled.map((c, idx) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + idx * 2);
    const dayStr = d.toISOString().split('T')[0];
    const start = idx % 2 === 0 ? '09:00' : '13:00';
    const end = idx % 2 === 0 ? '12:00' : '16:00';
    const venue = ['Hall A', 'Hall B', 'Hall C', 'Auditorium'][idx % 4];
    return { code: c.code.replace(/\s+/g, ''), title: c.title, date: dayStr, start, end, venue };
  });
};

const ExamTimetablePage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
          <Calendar size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examinations Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Check dates, time, and venues for your exams</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {buildExamSlots().map((exam) => (
                <tr key={exam.code} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{exam.code}</div>
                    <div className="text-xs text-gray-500">{exam.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {exam.start} - {exam.end}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {exam.venue}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      <FileText size={14} />
                      Seat by 30 mins early
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamTimetablePage;

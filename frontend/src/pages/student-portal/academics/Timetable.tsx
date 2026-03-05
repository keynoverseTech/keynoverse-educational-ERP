import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import StudentTimetable from '../timetable/TimetablePage';

const Timetable: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lectures Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your weekly class schedule</p>
        </div>
        <button
          onClick={() => navigate('/student/academics/timetable/exams')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm"
        >
          <Calendar size={16} /> View Exams Timetable
        </button>
      </div>
      <StudentTimetable />
    </div>
  );
};

export default Timetable;

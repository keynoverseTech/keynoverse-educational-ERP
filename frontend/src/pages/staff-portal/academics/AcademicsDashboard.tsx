import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Users, ClipboardCheck, Calendar } from 'lucide-react';

const cards = [
  {
    title: 'My Courses',
    description: 'View courses assigned to you.',
    icon: BookOpen,
    to: '/staff/academics/courses',
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
  },
  {
    title: 'Course Materials',
    description: 'Upload materials for students.',
    icon: FileText,
    to: '/staff/academics/materials',
    color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20',
  },
  {
    title: 'Students',
    description: 'View students in your courses.',
    icon: Users,
    to: '/staff/academics/students',
    color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
  },
  {
    title: 'Attendance',
    description: 'Create sessions and mark attendance.',
    icon: ClipboardCheck,
    to: '/staff/academics/attendance',
    color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
  },
  {
    title: 'Timetable',
    description: 'View your lecture schedule.',
    icon: Calendar,
    to: '/staff/academics/timetable',
    color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
  },
];

const AcademicsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage teaching activities and course delivery</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.to)}
            className="text-left bg-white dark:bg-[#151e32] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="font-bold text-gray-900 dark:text-white">{card.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AcademicsDashboard;


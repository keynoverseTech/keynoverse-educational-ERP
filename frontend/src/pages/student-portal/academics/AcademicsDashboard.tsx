import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardCheck, Calendar } from 'lucide-react';

const cards = [
  {
    title: 'Enrolled Courses',
    description: 'View and manage your registered courses.',
    icon: BookOpen,
    to: '/student/academics/courses',
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
  },
  {
    title: 'Timetable',
    description: 'View your lectures and exam schedule.',
    icon: Calendar,
    to: '/student/academics/timetable',
    color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
  },
  {
    title: 'Results',
    description: 'Check grades and academic performance.',
    icon: ClipboardCheck,
    to: '/student/academics/results',
    color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
  },
];

const AcademicsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Access courses, materials, results and timetable</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

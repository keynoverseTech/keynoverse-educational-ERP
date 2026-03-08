import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Play
} from 'lucide-react';

const StudentQuizzes: React.FC = () => {
  const quizzes = [
    {
      id: 1,
      title: 'Mid-Semester Assessment',
      course: 'MTH 302',
      questions: 20,
      duration: '45 mins',
      dueDate: '2024-03-30',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Physics Lab Safety Quiz',
      course: 'PHY 201',
      questions: 10,
      duration: '15 mins',
      dueDate: '2024-03-15',
      status: 'Completed',
      score: '9/10'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-red-600" />
            Quizzes
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and take online assessments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
              quiz.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {quiz.status}
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                {quiz.course}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <HelpCircle size={16} className="text-gray-400 mb-1" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{quiz.questions}</span>
                <span className="text-[10px] text-gray-500 uppercase">Questions</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <Clock size={16} className="text-gray-400 mb-1" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{quiz.duration}</span>
                <span className="text-[10px] text-gray-500 uppercase">Time</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <CheckCircle size={16} className="text-gray-400 mb-1" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{quiz.score || '-'}</span>
                <span className="text-[10px] text-gray-500 uppercase">Score</span>
              </div>
            </div>

            {quiz.status === 'Upcoming' && (
              <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Play size={16} /> Start Quiz
              </button>
            )}
            {quiz.status === 'Completed' && (
              <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                View Results
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentQuizzes;
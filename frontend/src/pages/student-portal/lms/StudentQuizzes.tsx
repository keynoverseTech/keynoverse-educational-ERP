import React, { useState } from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Play,
  BookOpen,
  ChevronLeft,
  Timer
} from 'lucide-react';

const StudentQuizzes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [currentView, setCurrentView] = useState<'list' | 'taking-quiz'>('list');
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  // Mock Courses (Enrolled)
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'MTH 302', title: 'Linear Algebra' },
    { code: 'PHY 201', title: 'General Physics' }
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Mid-Semester Assessment',
      courseCode: 'MTH 302',
      questions: 20,
      duration: '45 mins',
      dueDate: '2024-03-30',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Physics Lab Safety Quiz',
      courseCode: 'PHY 201',
      questions: 10,
      duration: '15 mins',
      dueDate: '2024-03-15',
      status: 'Completed',
      score: '9/10'
    },
    {
      id: 3,
      title: 'Software Development Life Cycle',
      courseCode: 'CSC 401',
      questions: 15,
      duration: '30 mins',
      dueDate: '2024-03-20',
      status: 'Missed'
    }
  ];

  const filteredQuizzes = quizzes.filter(q => {
    const matchesCourse = selectedCourse ? q.courseCode === selectedCourse : true;
    const matchesTab = activeTab === 'active' 
      ? (q.status === 'Upcoming' || q.status === 'Active') 
      : (q.status === 'Completed' || q.status === 'Missed');
    return matchesCourse && matchesTab;
  });

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentView('taking-quiz');
  };

  const handleSubmitQuiz = () => {
    // Mock submission
    setCurrentView('list');
    setActiveQuiz(null);
    alert('Quiz submitted successfully!');
  };

  return (
    <div className="space-y-6 p-6">
      {currentView === 'list' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="text-red-600" />
                Quizzes
              </h1>
              <p className="text-gray-500 dark:text-gray-400">Manage and take online assessments.</p>
            </div>

            {/* Course Filter */}
            <div className="relative min-w-[250px]">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              >
                <option value="">All My Courses</option>
                {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-1">
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-3 text-sm font-bold px-2 relative ${
                activeTab === 'active' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Upcoming / Active
              {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold px-2 relative ${
                activeTab === 'past' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Completed / Missed
              {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuizzes.length === 0 ? (
               <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                 <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                 <p className="text-gray-500 dark:text-gray-400 font-medium">No quizzes found.</p>
               </div>
            ) : (
              filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
                    quiz.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                    quiz.status === 'Missed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {quiz.status}
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                      {quiz.courseCode}
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
                    <button 
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play size={16} /> Start Quiz
                    </button>
                  )}
                  {quiz.status === 'Completed' && (
                    <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      View Results
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Taking Quiz View (Mock) */
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full font-bold text-sm">
              <Timer size={16} /> {activeQuiz?.duration} Remaining
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{activeQuiz?.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">This is a mock quiz interface. In a real application, questions would appear here one by one or in a list.</p>
            
            <button 
              onClick={handleSubmitQuiz}
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
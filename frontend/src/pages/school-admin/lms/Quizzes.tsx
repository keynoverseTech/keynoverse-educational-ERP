import React, { useState } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Filter,
  BookOpen,
  X,
  Settings,
  Users,
  BarChart2,
  ChevronLeft,
  Trash2,
  Type,
  FileText
} from 'lucide-react';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  courseCode: string;
  questions: Question[];
  duration: string;
  dueDate: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  score?: string;
  attempts: number;
  maxAttempts: number;
}

interface StudentResult {
  id: number;
  studentName: string;
  matricNumber: string;
  score: number;
  totalScore: number;
  submittedAt: string;
  status: 'Graded' | 'Pending';
}

const Quizzes: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'results'>('list');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Settings, 2: Questions

  // Filters State
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form State
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30, // minutes
    attempts: 1,
    startDate: '',
    endDate: '',
    randomize: false,
    autoGrade: true
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    points: 1,
    options: ['', '', '', '']
  });

  // Mock Data for Dropdowns
  const faculties = ['Faculty of Science', 'Faculty of Engineering', 'Faculty of Arts'];
  const departments = ['Computer Science', 'Electrical Engineering', 'English'];
  const programmes = ['HND Computer Science', 'B.Eng. Electrical', 'B.A. English'];
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'CSC 402', title: 'Artificial Intelligence' },
    { code: 'ENG 301', title: 'Digital Logic Design' }
  ];

  // Mock Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 1,
      title: 'Mid-Semester Assessment',
      courseCode: 'CSC 401',
      questions: Array(20).fill({ id: 0, type: 'multiple-choice', question: 'Sample', points: 1 }),
      duration: '45 mins',
      dueDate: '2024-03-30',
      status: 'Upcoming',
      attempts: 0,
      maxAttempts: 1
    },
    {
      id: 2,
      title: 'Physics Lab Safety Quiz',
      courseCode: 'CSC 401',
      questions: Array(10).fill({ id: 0, type: 'true-false', question: 'Sample', points: 1 }),
      duration: '15 mins',
      dueDate: '2024-03-15',
      status: 'Completed',
      score: '9/10',
      attempts: 1,
      maxAttempts: 3
    },
  ]);

  // Mock Results Data
  const [results] = useState<StudentResult[]>([
    { id: 1, studentName: 'John Doe', matricNumber: 'SCI/20/001', score: 18, totalScore: 20, submittedAt: 'Mar 15, 10:30 AM', status: 'Graded' },
    { id: 2, studentName: 'Jane Smith', matricNumber: 'SCI/20/045', score: 15, totalScore: 20, submittedAt: 'Mar 15, 11:15 AM', status: 'Graded' },
    { id: 3, studentName: 'Michael Brown', matricNumber: 'SCI/20/022', score: 0, totalScore: 20, submittedAt: 'Pending', status: 'Pending' },
  ]);

  const handleCreateQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now(),
      title: quizData.title,
      courseCode: selectedCourse,
      questions: questions,
      duration: `${quizData.timeLimit} mins`,
      dueDate: quizData.endDate,
      status: 'Upcoming',
      attempts: 0,
      maxAttempts: quizData.attempts
    };
    setQuizzes([...quizzes, newQuiz]);
    setIsModalOpen(false);
    setQuizData({
      title: '', description: '', timeLimit: 30, attempts: 1,
      startDate: '', endDate: '', randomize: false, autoGrade: true
    });
    setQuestions([]);
    setCurrentStep(1);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question) return;
    
    const newQ: Question = {
      id: Date.now(),
      type: currentQuestion.type as any,
      question: currentQuestion.question || '',
      options: currentQuestion.type === 'multiple-choice' ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1
    };
    
    setQuestions([...questions, newQ]);
    setCurrentQuestion({
      type: 'multiple-choice',
      points: 1,
      options: ['', '', '', ''],
      question: '',
      correctAnswer: ''
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleViewResults = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('results');
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    setCurrentView('list');
  };

  const filteredQuizzes = quizzes.filter(q => 
    selectedCourse ? q.courseCode === selectedCourse : true
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-red-600" />
            Quizzes
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and take online assessments.</p>
        </div>
        {currentView === 'list' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedCourse}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
              selectedCourse 
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={16} /> Create Quiz
          </button>
        )}
      </div>

      {/* Filters (Only show in list view) */}
      {currentView === 'list' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Faculty</option>
                {faculties.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Programme</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedProgramme}
                onChange={(e) => setSelectedProgramme(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Programme</option>
                {programmes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Select a course to view quizzes</h3>
          <p className="text-sm text-gray-400">Use the filters above to navigate to a specific course.</p>
        </div>
      ) : (
        <>
          {currentView === 'list' ? (
            /* Quiz List View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
                    quiz.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{quiz.questions.length}</span>
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

                  <div className="space-y-2">
                    {quiz.status === 'Upcoming' && (
                      <button className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        <Settings size={16} /> Edit Settings
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewResults(quiz)}
                      className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <BarChart2 size={16} /> View Results
                    </button>
                  </div>
                </div>
              ))}
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 italic">
                  No quizzes found for this course.
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6">
              <button 
                onClick={handleBackToList}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={16} /> Back to Quizzes
              </button>

              {selectedQuiz && (
                <>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedQuiz.title}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={16} /> {selectedQuiz.duration}</span>
                        <span className="flex items-center gap-1"><HelpCircle size={16} /> {selectedQuiz.questions.length} Questions</span>
                        <span className="flex items-center gap-1"><FileText size={16} /> Due: {selectedQuiz.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">85%</p>
                        <p className="text-xs text-gray-500">Avg. Score</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">42</p>
                        <p className="text-xs text-gray-500">Attempts</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users size={18} /> Student Performance
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Matric No.</th>
                          <th className="px-6 py-4">Submitted</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {results.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{result.studentName}</td>
                            <td className="px-6 py-4 text-gray-500">{result.matricNumber}</td>
                            <td className="px-6 py-4 text-gray-500">{result.submittedAt}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                result.status === 'Graded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {result.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold">
                              {result.status === 'Graded' ? `${result.score} / ${result.totalScore}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
            
            {/* Steps Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                   <span className={`text-sm font-medium ${currentStep === 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Settings</span>
                 </div>
                 <div className="w-12 h-px bg-gray-300 dark:bg-gray-600"></div>
                 <div className="flex items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep === 2 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>2</div>
                   <span className={`text-sm font-medium ${currentStep === 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Questions</span>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {currentStep === 1 ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz Title</label>
                    <input 
                      type="text" 
                      value={quizData.title}
                      onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="e.g., Mid-Semester Assessment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description / Instructions</label>
                    <textarea 
                      value={quizData.description}
                      onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Limit (Minutes)</label>
                      <input 
                        type="number" 
                        value={quizData.timeLimit}
                        onChange={(e) => setQuizData({...quizData, timeLimit: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attempts Allowed</label>
                      <input 
                        type="number" 
                        value={quizData.attempts}
                        onChange={(e) => setQuizData({...quizData, attempts: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={quizData.startDate}
                        onChange={(e) => setQuizData({...quizData, startDate: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={quizData.endDate}
                        onChange={(e) => setQuizData({...quizData, endDate: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="randomize"
                        checked={quizData.randomize}
                        onChange={(e) => setQuizData({...quizData, randomize: e.target.checked})}
                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="randomize" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Randomize Questions</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="autoGrade"
                        checked={quizData.autoGrade}
                        onChange={(e) => setQuizData({...quizData, autoGrade: e.target.checked})}
                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="autoGrade" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Automatic Grading</label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Add New Question Form */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                      <Plus size={16} /> Add New Question
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                       <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Type</label>
                         <select 
                           value={currentQuestion.type}
                           onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as any})}
                           className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                         >
                           <option value="multiple-choice">Multiple Choice</option>
                           <option value="true-false">True / False</option>
                           <option value="short-answer">Short Answer</option>
                           <option value="essay">Essay</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Points</label>
                         <input 
                           type="number"
                           value={currentQuestion.points}
                           onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
                           className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                           min="1"
                         />
                       </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Text</label>
                      <textarea 
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
                        rows={2}
                        placeholder="Enter your question here..."
                      />
                    </div>

                    {currentQuestion.type === 'multiple-choice' && (
                      <div className="space-y-3 mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Options</label>
                        {currentQuestion.options?.map((opt, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                            <input 
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(idx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                              placeholder={`Option ${idx + 1}`}
                            />
                            <input 
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuestion.correctAnswer === opt && opt !== ''}
                              onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: opt})}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                              title="Mark as correct answer"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === 'true-false' && (
                      <div className="flex gap-6 mb-4">
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                             type="radio"
                             name="tf-answer"
                             checked={currentQuestion.correctAnswer === 'True'}
                             onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'True'})}
                             className="w-4 h-4 text-green-600"
                           />
                           <span className="text-sm">True</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                             type="radio"
                             name="tf-answer"
                             checked={currentQuestion.correctAnswer === 'False'}
                             onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'False'})}
                             className="w-4 h-4 text-green-600"
                           />
                           <span className="text-sm">False</span>
                         </label>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddQuestion}
                        disabled={!currentQuestion.question}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>

                  {/* Added Questions List */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center justify-between">
                      <span>Questions Added ({questions.length})</span>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Total Points: {questions.reduce((acc, q) => acc + q.points, 0)}</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {questions.map((q, idx) => (
                        <div key={q.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                          <button 
                            onClick={() => removeQuestion(q.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="flex items-start gap-3">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded">Q{idx + 1}</span>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{q.question}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Type size={12} /> {q.type}</span>
                                <span className="font-bold text-green-600">{q.points} pts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {questions.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          No questions added yet. Use the form above to add questions.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center shrink-0 rounded-b-2xl">
              {currentStep === 1 ? (
                <>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 font-medium text-sm hover:text-gray-900">Cancel</button>
                  <button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!quizData.title}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Add Questions
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setCurrentStep(1)} className="text-gray-500 font-medium text-sm hover:text-gray-900">Back to Settings</button>
                  <button 
                    onClick={handleCreateQuiz}
                    disabled={questions.length === 0}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Finish & Create Quiz
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;

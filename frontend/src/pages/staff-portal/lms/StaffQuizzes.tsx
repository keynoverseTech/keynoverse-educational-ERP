import React, { useEffect, useMemo, useState } from 'react';
import { BarChart2, BookOpen, CheckCircle, ChevronLeft, Clock, HelpCircle, Plus, Save, Trash2, Type, Users, X } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

type QuizStatus = 'Upcoming' | 'Active' | 'Completed';
type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface StaffQuiz {
  id: string;
  title: string;
  courseCode: string;
  durationMins: number;
  attemptsAllowed: number;
  startDateTime: string;
  endDateTime: string;
  randomize: boolean;
  status: QuizStatus;
  questions: QuizQuestion[];
  createdAt: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  studentName: string;
  matricNumber: string;
  attemptNumber: number;
  score: number;
  totalScore: number;
  submittedAt: string;
}

const QUIZZES_KEY = 'staff_lms_quizzes';
const ATTEMPTS_KEY = 'staff_lms_quiz_attempts';

const loadQuizzes = (): StaffQuiz[] => {
  const raw = localStorage.getItem(QUIZZES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StaffQuiz[];
  } catch {
    return [];
  }
};

const saveQuizzes = (data: StaffQuiz[]) => {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(data));
};

const loadAttempts = (): QuizAttempt[] => {
  const raw = localStorage.getItem(ATTEMPTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QuizAttempt[];
  } catch {
    return [];
  }
};

const saveAttempts = (data: QuizAttempt[]) => {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
};

const StaffQuizzes: React.FC = () => {
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const allowedCourseCodes = useMemo(() => new Set(assignedCourses.map(c => c.code)), [assignedCourses]);

  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'list' | 'manage'>('list');
  const [manageTab, setManageTab] = useState<'questions' | 'results'>('questions');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);

  const [quizzes, setQuizzes] = useState<StaffQuiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const [form, setForm] = useState({
    title: '',
    courseCode: '',
    durationMins: 30,
    attemptsAllowed: 1,
    startDateTime: '',
    endDateTime: '',
    randomize: false
  });

  const [questionsDraft, setQuestionsDraft] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    type: 'multiple-choice',
    points: 1,
    options: ['', '', '', '']
  });

  useEffect(() => {
    setQuizzes(loadQuizzes());
    setAttempts(loadAttempts());
  }, []);

  useEffect(() => {
    saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveAttempts(attempts);
  }, [attempts]);

  const selectedQuiz = useMemo(() => {
    if (!selectedQuizId) return null;
    const quiz = quizzes.find(q => q.id === selectedQuizId) || null;
    if (!quiz) return null;
    if (!allowedCourseCodes.has(quiz.courseCode)) return null;
    return quiz;
  }, [allowedCourseCodes, quizzes, selectedQuizId]);

  const filteredQuizzes = useMemo(() => {
    let res = quizzes.filter(q => allowedCourseCodes.has(q.courseCode));
    if (selectedCourse !== 'All') res = res.filter(q => q.courseCode === selectedCourse);
    return res.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allowedCourseCodes, quizzes, selectedCourse]);

  const openCreate = () => {
    setForm({
      title: '',
      courseCode: assignedCourses[0]?.code || '',
      durationMins: 30,
      attemptsAllowed: 1,
      startDateTime: '',
      endDateTime: '',
      randomize: false
    });
    setQuestionsDraft([]);
    setCurrentQuestion({
      type: 'multiple-choice',
      points: 1,
      options: ['', '', '', ''],
      question: '',
      correctAnswer: ''
    });
    setCreateStep(1);
    setIsModalOpen(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...(currentQuestion.options || [])];
    updated[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: updated }));
  };

  const addQuestionToDraft = () => {
    if (!currentQuestion.question) return;
    const q: QuizQuestion = {
      id: `qq-${Date.now()}`,
      type: (currentQuestion.type as QuestionType) || 'multiple-choice',
      question: currentQuestion.question,
      options: currentQuestion.type === 'multiple-choice' ? (currentQuestion.options || ['', '', '', '']) : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1
    };
    setQuestionsDraft(prev => [...prev, q]);
    setCurrentQuestion({
      type: 'multiple-choice',
      points: 1,
      options: ['', '', '', ''],
      question: '',
      correctAnswer: ''
    });
  };

  const removeDraftQuestion = (id: string) => {
    setQuestionsDraft(prev => prev.filter(q => q.id !== id));
  };

  const createQuiz = () => {
    if (!form.courseCode || !allowedCourseCodes.has(form.courseCode)) return;
    if (!form.title) return;
    if (questionsDraft.length === 0) return;
    const newQuiz: StaffQuiz = {
      id: `qz-${Date.now()}`,
      title: form.title,
      courseCode: form.courseCode,
      durationMins: form.durationMins,
      attemptsAllowed: form.attemptsAllowed,
      startDateTime: form.startDateTime,
      endDateTime: form.endDateTime,
      randomize: form.randomize,
      status: 'Upcoming',
      questions: questionsDraft,
      createdAt: new Date().toISOString()
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    setIsModalOpen(false);
    setCreateStep(1);
  };

  const openManage = (quizId: string) => {
    setSelectedQuizId(quizId);
    setManageTab('questions');
    setCurrentView('manage');
  };

  const updateQuizQuestions = (quizId: string, updater: (prev: QuizQuestion[]) => QuizQuestion[]) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id !== quizId) return q;
        if (!allowedCourseCodes.has(q.courseCode)) return q;
        return { ...q, questions: updater(q.questions) };
      })
    );
  };

  const addQuestionToQuiz = () => {
    if (!selectedQuiz) return;
    if (!currentQuestion.question) return;
    const q: QuizQuestion = {
      id: `qq-${Date.now()}`,
      type: (currentQuestion.type as QuestionType) || 'multiple-choice',
      question: currentQuestion.question,
      options: currentQuestion.type === 'multiple-choice' ? (currentQuestion.options || ['', '', '', '']) : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1
    };
    updateQuizQuestions(selectedQuiz.id, prev => [...prev, q]);
    setCurrentQuestion({
      type: 'multiple-choice',
      points: 1,
      options: ['', '', '', ''],
      question: '',
      correctAnswer: ''
    });
  };

  const removeQuestionFromQuiz = (questionId: string) => {
    if (!selectedQuiz) return;
    updateQuizQuestions(selectedQuiz.id, prev => prev.filter(q => q.id !== questionId));
  };

  const seedAttemptsForQuiz = (quiz: StaffQuiz) => {
    const total = quiz.questions.reduce((acc, q) => acc + q.points, 0);
    const existing = attempts.filter(a => a.quizId === quiz.id);
    if (existing.length > 0) return;
    const seeded: QuizAttempt[] = [
      {
        id: `qa-${quiz.id}-1`,
        quizId: quiz.id,
        studentName: 'John Doe',
        matricNumber: 'SCI/20/001',
        attemptNumber: 1,
        score: Math.max(0, Math.min(total, Math.round(total * 0.85))),
        totalScore: total,
        submittedAt: 'Mar 15, 10:30 AM'
      },
      {
        id: `qa-${quiz.id}-2`,
        quizId: quiz.id,
        studentName: 'Jane Smith',
        matricNumber: 'SCI/20/045',
        attemptNumber: 1,
        score: Math.max(0, Math.min(total, Math.round(total * 0.72))),
        totalScore: total,
        submittedAt: 'Mar 15, 11:15 AM'
      },
      {
        id: `qa-${quiz.id}-3`,
        quizId: quiz.id,
        studentName: 'Jane Smith',
        matricNumber: 'SCI/20/045',
        attemptNumber: 2,
        score: Math.max(0, Math.min(total, Math.round(total * 0.9))),
        totalScore: total,
        submittedAt: 'Mar 16, 09:05 AM'
      }
    ];
    setAttempts(prev => [...prev, ...seeded]);
  };

  const attemptsForSelectedQuiz = useMemo(() => {
    if (!selectedQuiz) return [];
    return attempts
      .filter(a => a.quizId === selectedQuiz.id)
      .slice()
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [attempts, selectedQuiz]);

  const attemptBreakdown = useMemo(() => {
    const grouped = new Map<number, QuizAttempt[]>();
    attemptsForSelectedQuiz.forEach(a => {
      if (!grouped.has(a.attemptNumber)) grouped.set(a.attemptNumber, []);
      grouped.get(a.attemptNumber)!.push(a);
    });
    const items = [...grouped.entries()].map(([attemptNumber, list]) => {
      const avg = list.length ? list.reduce((acc, x) => acc + x.score, 0) / list.length : 0;
      return { attemptNumber, submissions: list.length, average: avg };
    });
    items.sort((a, b) => a.attemptNumber - b.attemptNumber);
    return items;
  }, [attemptsForSelectedQuiz]);

  const overallStats = useMemo(() => {
    if (!selectedQuiz) return { totalAttempts: 0, avg: 0, best: 0 };
    if (attemptsForSelectedQuiz.length === 0) return { totalAttempts: 0, avg: 0, best: 0 };
    const avg = attemptsForSelectedQuiz.reduce((acc, a) => acc + a.score, 0) / attemptsForSelectedQuiz.length;
    const best = Math.max(...attemptsForSelectedQuiz.map(a => a.score));
    return { totalAttempts: attemptsForSelectedQuiz.length, avg, best };
  }, [attemptsForSelectedQuiz, selectedQuiz]);

  useEffect(() => {
    if (currentView !== 'manage') return;
    if (manageTab !== 'results') return;
    if (!selectedQuiz) return;
    seedAttemptsForQuiz(selectedQuiz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, manageTab, selectedQuizId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {currentView === 'list' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="text-red-600" />
                Quizzes
              </h1>
              <p className="text-gray-500 dark:text-gray-400">Create and track quizzes for your assigned courses.</p>
            </div>
            <button
              onClick={openCreate}
              disabled={assignedCourses.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
                assignedCourses.length > 0 ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={16} /> Create Quiz
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="relative w-72">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="All">All My Courses</option>
                {assignedCourses.map(c => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(q => (
              <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
                  q.status === 'Completed' ? 'bg-green-100 text-green-700' : q.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {q.status}
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                    {q.courseCode}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{q.title}</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <HelpCircle size={16} className="text-gray-400 mb-1" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{q.questions.length}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Questions</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <Clock size={16} className="text-gray-400 mb-1" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{q.durationMins} mins</span>
                    <span className="text-[10px] text-gray-500 uppercase">Time</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <CheckCircle size={16} className="text-gray-400 mb-1" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{q.attemptsAllowed}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Attempts</span>
                  </div>
                </div>
                <button
                  onClick={() => openManage(q.id)}
                  className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Manage
                </button>
              </div>
            ))}
            {filteredQuizzes.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 italic">No quizzes found.</div>
            )}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setCurrentView('list');
              setSelectedQuizId(null);
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft size={16} /> Back to Quizzes
          </button>

          {!selectedQuiz ? (
            <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              Quiz not available.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                        {selectedQuiz.courseCode}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedQuiz.title}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedQuiz.questions.length} questions • {selectedQuiz.durationMins} mins • {selectedQuiz.attemptsAllowed} attempt(s)
                    </p>
                  </div>

                  <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                    <button
                      onClick={() => setManageTab('questions')}
                      className={`px-3 py-1.5 text-xs font-bold rounded ${
                        manageTab === 'questions' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Questions
                    </button>
                    <button
                      onClick={() => setManageTab('results')}
                      className={`px-3 py-1.5 text-xs font-bold rounded ${
                        manageTab === 'results' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Results
                    </button>
                  </div>
                </div>
              </div>

              {manageTab === 'questions' ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                      <Plus size={16} /> Add Question
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Type</label>
                        <select
                          value={currentQuestion.type}
                          onChange={e => setCurrentQuestion(prev => ({ ...prev, type: e.target.value as QuestionType }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none text-sm"
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
                          value={currentQuestion.points || 1}
                          onChange={e => setCurrentQuestion(prev => ({ ...prev, points: Number(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question</label>
                        <textarea
                          value={currentQuestion.question || ''}
                          onChange={e => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
                          rows={3}
                        />
                      </div>

                      {currentQuestion.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase">Options</label>
                          {(currentQuestion.options || []).map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                              />
                              <input
                                type="radio"
                                name="mc-correct"
                                checked={currentQuestion.correctAnswer === opt && opt !== ''}
                                onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: opt }))}
                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'true-false' && (
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tf-correct"
                              checked={currentQuestion.correctAnswer === 'True'}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 'True' }))}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">True</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tf-correct"
                              checked={currentQuestion.correctAnswer === 'False'}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 'False' }))}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">False</span>
                          </label>
                        </div>
                      )}

                      <button
                        onClick={addQuestionToQuiz}
                        disabled={!currentQuestion.question}
                        className="w-full py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Save size={16} /> Add Question
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Questions ({selectedQuiz.questions.length})</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                        Total Points: {selectedQuiz.questions.reduce((acc, q) => acc + q.points, 0)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedQuiz.questions.map((q, idx) => (
                        <div key={q.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold px-2 py-1 rounded">
                                Q{idx + 1}
                              </span>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{q.question}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Type size={12} /> {q.type}
                                  </span>
                                  <span className="font-bold text-green-600">{q.points} pts</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeQuestionFromQuiz(q.id)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {selectedQuiz.questions.length === 0 && (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          No questions yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                          <Users size={22} />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Attempts</span>
                      </div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white">{overallStats.totalAttempts}</div>
                      <div className="text-xs text-gray-500">Total submissions across attempts</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                          <CheckCircle size={22} />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Average</span>
                      </div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white">{Math.round(overallStats.avg)}</div>
                      <div className="text-xs text-gray-500">Average score (all attempts)</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600">
                          <BarChart2 size={22} />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Best</span>
                      </div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white">{overallStats.best}</div>
                      <div className="text-xs text-gray-500">Highest score</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4">Attempt Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {attemptBreakdown.map(b => (
                        <div key={b.attemptNumber} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                          <div className="text-xs font-bold text-gray-500 uppercase">Attempt {b.attemptNumber}</div>
                          <div className="mt-2 flex items-end justify-between">
                            <div className="text-2xl font-black text-gray-900 dark:text-white">{Math.round(b.average)}</div>
                            <div className="text-xs text-gray-500">{b.submissions} submissions</div>
                          </div>
                        </div>
                      ))}
                      {attemptBreakdown.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          No attempt data yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users size={18} /> Attempt History
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Matric</th>
                          <th className="px-6 py-4">Attempt</th>
                          <th className="px-6 py-4">Submitted</th>
                          <th className="px-6 py-4 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {attemptsForSelectedQuiz.map(a => (
                          <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.studentName}</td>
                            <td className="px-6 py-4 text-gray-500">{a.matricNumber}</td>
                            <td className="px-6 py-4 text-gray-500">{a.attemptNumber}</td>
                            <td className="px-6 py-4 text-gray-500">{a.submittedAt}</td>
                            <td className="px-6 py-4 text-right font-bold">{a.score} / {a.totalScore}</td>
                          </tr>
                        ))}
                        {attemptsForSelectedQuiz.length === 0 && (
                          <tr>
                            <td className="px-6 py-10 text-center text-gray-400 italic" colSpan={5}>
                              No attempts found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${createStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                  <span className={`text-sm font-medium ${createStep === 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Settings</span>
                </div>
                <div className="w-12 h-px bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${createStep === 2 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>2</div>
                  <span className={`text-sm font-medium ${createStep === 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Questions</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {createStep === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
                      <select
                        value={form.courseCode}
                        onChange={e => setForm(prev => ({ ...prev, courseCode: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                        required
                      >
                        <option value="" disabled>Select Course</option>
                        {assignedCourses.map(c => (
                          <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (mins)</label>
                      <input
                        type="number"
                        value={form.durationMins}
                        onChange={e => setForm(prev => ({ ...prev, durationMins: Number(e.target.value) }))}
                        min={1}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attempts Allowed</label>
                      <input
                        type="number"
                        value={form.attemptsAllowed}
                        onChange={e => setForm(prev => ({ ...prev, attemptsAllowed: Number(e.target.value) }))}
                        min={1}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start</label>
                      <input
                        type="datetime-local"
                        value={form.startDateTime}
                        onChange={e => setForm(prev => ({ ...prev, startDateTime: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End</label>
                      <input
                        type="datetime-local"
                        value={form.endDateTime}
                        onChange={e => setForm(prev => ({ ...prev, endDateTime: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.randomize}
                      onChange={e => setForm(prev => ({ ...prev, randomize: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Randomize questions</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                      <Plus size={16} /> Add New Question
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Type</label>
                        <select
                          value={currentQuestion.type}
                          onChange={e => setCurrentQuestion(prev => ({ ...prev, type: e.target.value as QuestionType }))}
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
                          value={currentQuestion.points || 1}
                          onChange={e => setCurrentQuestion(prev => ({ ...prev, points: Number(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Text</label>
                      <textarea
                        value={currentQuestion.question || ''}
                        onChange={e => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
                        rows={2}
                      />
                    </div>

                    {currentQuestion.type === 'multiple-choice' && (
                      <div className="space-y-3 mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Options</label>
                        {(currentQuestion.options || []).map((opt, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => handleOptionChange(idx, e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                            />
                            <input
                              type="radio"
                              name="draft-correct"
                              checked={currentQuestion.correctAnswer === opt && opt !== ''}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: opt }))}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
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
                            name="draft-tf"
                            checked={currentQuestion.correctAnswer === 'True'}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 'True' }))}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm">True</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="draft-tf"
                            checked={currentQuestion.correctAnswer === 'False'}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 'False' }))}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm">False</span>
                        </label>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={addQuestionToDraft}
                        disabled={!currentQuestion.question}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Questions Added ({questionsDraft.length})</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Total Points: {questionsDraft.reduce((acc, q) => acc + q.points, 0)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {questionsDraft.map((q, idx) => (
                        <div key={q.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                          <button
                            onClick={() => removeDraftQuestion(q.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-start gap-3">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded">
                              Q{idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{q.question}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Type size={12} /> {q.type}
                                </span>
                                <span className="font-bold text-green-600">{q.points} pts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {questionsDraft.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          No questions added yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center shrink-0 rounded-b-2xl">
              {createStep === 1 ? (
                <>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 font-medium text-sm hover:text-gray-900">
                    Cancel
                  </button>
                  <button
                    onClick={() => setCreateStep(2)}
                    disabled={!form.title || !form.courseCode}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Add Questions
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setCreateStep(1)} className="text-gray-500 font-medium text-sm hover:text-gray-900">
                    Back to Settings
                  </button>
                  <button
                    onClick={createQuiz}
                    disabled={questionsDraft.length === 0}
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

export default StaffQuizzes;

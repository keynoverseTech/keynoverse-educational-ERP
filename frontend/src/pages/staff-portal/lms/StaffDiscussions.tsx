import { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  Plus,
  MessageCircle,
  Filter,
  BookOpen,
  Paperclip,
  Send,
  Trash2,
  Flag,
  ChevronLeft,
  X,
  Pin,
  User
} from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

type UserRole = 'Student' | 'Lecturer';

type Reply = {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  createdAt: string;
};

type Discussion = {
  id: string;
  topic: string;
  courseCode: string;
  author: string;
  role: UserRole;
  createdAt: string;
  content: string;
  replies: Reply[];
  isPinned?: boolean;
};

type ViewState = 'list' | 'detail';

const STORAGE_KEY = 'staff_lms_discussions';

const loadDiscussions = (): Discussion[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Discussion[];
  } catch {
    return [];
  }
};

const saveDiscussions = (data: Discussion[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    return;
  }
};

const toDate = (value: string) => {
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  return new Date(`${value}T00:00:00`);
};

const timeAgo = (iso: string) => {
  const d = toDate(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const currentLecturerName = 'Dr. Sarah';

const StaffDiscussions = () => {
  const assignedCourses = useMemo(() => getAssignedCourses(), []);

  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [search, setSearch] = useState('');

  const [newTopicData, setNewTopicData] = useState({
    topic: '',
    content: '',
    attachments: null as FileList | null
  });
  const [replyContent, setReplyContent] = useState('');

  const [discussions, setDiscussions] = useState<Discussion[]>(() => loadDiscussions());

  const allowedCourseCodes = useMemo(() => new Set(assignedCourses.map(c => c.code)), [assignedCourses]);

  useEffect(() => {
    const inScope = discussions.filter(d => allowedCourseCodes.has(d.courseCode));
    if (inScope.length !== discussions.length) {
      setDiscussions(inScope);
    }
  }, [allowedCourseCodes, discussions]);

  useEffect(() => {
    saveDiscussions(discussions);
  }, [discussions]);

  useEffect(() => {
    if (!selectedCourse && assignedCourses.length > 0) {
      setSelectedCourse(assignedCourses[0].code);
    }
  }, [assignedCourses, selectedCourse]);

  useEffect(() => {
    if (discussions.length > 0) return;
    if (assignedCourses.length === 0) return;
    const seed: Discussion[] = [
      {
        id: `d-${Date.now()}`,
        topic: 'Welcome to the course discussion forum',
        courseCode: assignedCourses[0].code,
        author: currentLecturerName,
        role: 'Lecturer',
        createdAt: new Date().toISOString(),
        content: 'Use this space to ask questions about lectures, assignments, and announcements for this course.',
        isPinned: true,
        replies: [
          {
            id: `r-${Date.now() + 1}`,
            author: 'Class Representative',
            role: 'Student',
            createdAt: new Date().toISOString(),
            content: 'Thank you, Doc. We will post questions here.'
          }
        ]
      }
    ];
    setDiscussions(seed);
  }, [assignedCourses, discussions.length]);

  const selectedDiscussion = useMemo(() => {
    if (!selectedDiscussionId) return null;
    return discussions.find(d => d.id === selectedDiscussionId) ?? null;
  }, [discussions, selectedDiscussionId]);

  const filteredDiscussions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return discussions
      .filter(d => (selectedCourse ? d.courseCode === selectedCourse : true))
      .filter(d => allowedCourseCodes.has(d.courseCode))
      .filter(d => {
        if (!q) return true;
        return (
          d.topic.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime();
      });
  }, [allowedCourseCodes, discussions, search, selectedCourse]);

  const handleOpenDiscussion = (id: string) => {
    setSelectedDiscussionId(id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedDiscussionId(null);
    setCurrentView('list');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!allowedCourseCodes.has(selectedCourse)) return;
    if (!newTopicData.topic.trim() || !newTopicData.content.trim()) return;

    const newDiscussion: Discussion = {
      id: `d-${Date.now()}`,
      topic: newTopicData.topic.trim(),
      courseCode: selectedCourse,
      author: currentLecturerName,
      role: 'Lecturer',
      createdAt: new Date().toISOString(),
      content: newTopicData.content.trim(),
      replies: [],
      isPinned: false
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setIsModalOpen(false);
    setNewTopicData({ topic: '', content: '', attachments: null });
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion) return;
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: `r-${Date.now()}`,
      author: currentLecturerName,
      role: 'Lecturer',
      content: replyContent.trim(),
      createdAt: new Date().toISOString()
    };

    setDiscussions(prev =>
      prev.map(d => (d.id === selectedDiscussion.id ? { ...d, replies: [...d.replies, newReply] } : d))
    );
    setReplyContent('');
  };

  const handleDeleteDiscussion = (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    setDiscussions(prev => prev.filter(d => d.id !== id));
    if (selectedDiscussionId === id) handleBackToList();
  };

  const handlePinDiscussion = (id: string) => {
    setDiscussions(prev => prev.map(d => (d.id === id ? { ...d, isPinned: !d.isPinned } : d)));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-green-600" />
            Discussions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Communicate with students in your assigned courses.</p>
        </div>
        {currentView === 'list' && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedCourse}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
              selectedCourse
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={16} /> New Topic
          </button>
        )}
      </div>

      {currentView === 'list' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            <div className="relative w-full md:w-96">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {assignedCourses.length === 0 && <option value="">No assigned courses</option>}
                {assignedCourses.map(c => (
                  <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic, author, or content..."
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">No course selected</h3>
          <p className="text-sm text-gray-400">Select one of your assigned courses to view discussions.</p>
        </div>
      ) : (
        <>
          {currentView === 'list' ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  onClick={() => handleOpenDiscussion(discussion.id)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        discussion.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {discussion.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                            {discussion.topic}
                          </h3>
                          {discussion.isPinned && <Pin size={14} className="text-orange-500 fill-orange-500" />}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{discussion.author}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            discussion.role === 'Lecturer'
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {discussion.role}
                          </span>
                          <span>• {timeAgo(discussion.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteDiscussion(discussion.id); }}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Delete Topic"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePinDiscussion(discussion.id); }}
                        className={`p-2 rounded-full transition-colors ${
                          discussion.isPinned ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 text-gray-400 hover:text-orange-500'
                        }`}
                        title="Pin Topic"
                      >
                        <Pin size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {discussion.content}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <MessageCircle size={16} />
                      <span>{discussion.replies.length} Replies</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDiscussions.length === 0 && (
                <div className="py-12 text-center text-gray-400 italic">
                  No discussions yet for this course.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={16} /> Back to Discussions
              </button>

              {selectedDiscussion && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          selectedDiscussion.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {selectedDiscussion.author.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDiscussion.topic}</h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{selectedDiscussion.author}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              selectedDiscussion.role === 'Lecturer'
                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {selectedDiscussion.role}
                            </span>
                            <span>• {timeAgo(selectedDiscussion.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400" title="Report">
                          <Flag size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscussion(selectedDiscussion.id)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                      <p>{selectedDiscussion.content}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageCircle size={18} /> {selectedDiscussion.replies.length} Replies
                    </h3>

                    {selectedDiscussion.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                          reply.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {reply.author.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl rounded-tl-none p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900 dark:text-white">{reply.author}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  reply.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-600'
                                }`}>{reply.role}</span>
                              </div>
                              <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                          </div>
                          <div className="flex items-center gap-4 px-2">
                            <button className="text-xs font-medium text-gray-500 hover:text-blue-600">Reply</button>
                            <button className="text-xs font-medium text-gray-400 hover:text-red-500 ml-auto">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handlePostReply} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        <User size={18} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={3}
                          className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <button type="button" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <Paperclip size={20} />
                          </button>
                          <button
                            type="submit"
                            disabled={!replyContent.trim()}
                            className={`px-6 py-2 rounded-lg font-bold text-white transition-colors flex items-center gap-2 ${
                              replyContent.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <Send size={16} /> Post Reply
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Start New Discussion</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      {assignedCourses.map(c => (
                        <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                  <input
                    type="text"
                    value={newTopicData.topic}
                    onChange={(e) => setNewTopicData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Enter discussion topic"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  value={newTopicData.content}
                  onChange={(e) => setNewTopicData(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments (optional)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setNewTopicData(prev => ({ ...prev, attachments: e.target.files }))}
                  className="w-full text-sm"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 mr-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2"
                >
                  <Send size={16} /> Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDiscussions;

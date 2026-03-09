import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  MessageCircle,
  ThumbsUp,
  Filter,
  BookOpen,
  Paperclip,
  Send,
  Trash2,
  Flag,
  ChevronLeft,
  X,
  Pin
} from 'lucide-react';

interface Reply {
  id: number;
  author: string;
  role: 'Student' | 'Lecturer' | 'Admin';
  content: string;
  date: string;
  attachments?: { name: string; size: string }[];
}

interface Discussion {
  id: number;
  topic: string;
  courseCode: string;
  author: string;
  role: 'Student' | 'Lecturer' | 'Admin';
  date: string;
  content: string;
  replies: Reply[];
  likes: number;
  isPinned?: boolean;
}

const Discussions: React.FC = () => {
  // View State: 'list' or 'detail'
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form State
  const [newTopicData, setNewTopicData] = useState({
    topic: '',
    content: '',
    attachments: null as FileList | null
  });
  const [replyContent, setReplyContent] = useState('');

  // Mock Data for Dropdowns
  const faculties = ['Faculty of Science', 'Faculty of Engineering', 'Faculty of Arts'];
  const departments = ['Computer Science', 'Electrical Engineering', 'English'];
  const programmes = ['B.Sc. Computer Science', 'B.Eng. Electrical', 'B.A. English'];
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'CSC 402', title: 'Artificial Intelligence' },
    { code: 'ENG 301', title: 'Digital Logic Design' }
  ];

  // Mock Discussions Data
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      topic: 'Clarification on Week 2 Assignment',
      courseCode: 'CSC 401',
      author: 'John Doe',
      role: 'Student',
      date: '2 hours ago',
      content: 'I am a bit confused about the requirements for the third section of the assignment. Can anyone clarify if we need to include UML diagrams for the database schema?',
      likes: 12,
      isPinned: false,
      replies: [
        {
          id: 101,
          author: 'Dr. A. Bello',
          role: 'Lecturer',
          content: 'Yes, John. An ER diagram or UML class diagram is required for the schema section.',
          date: '1 hour ago'
        },
        {
          id: 102,
          author: 'Jane Smith',
          role: 'Student',
          content: 'Thanks Dr. Bello! I was wondering the same thing.',
          date: '45 mins ago'
        }
      ]
    },
    {
      id: 2,
      topic: 'Interesting Article on Quantum Computing',
      courseCode: 'CSC 401',
      author: 'Dr. A. Bello',
      role: 'Lecturer',
      date: '1 day ago',
      content: 'Here is a link to a fascinating article I found regarding our discussion on quantum algorithms yesterday. Worth a read!',
      likes: 24,
      isPinned: true,
      replies: []
    },
  ]);

  const handleOpenDiscussion = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedDiscussion(null);
    setCurrentView('list');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiscussion: Discussion = {
      id: Date.now(),
      topic: newTopicData.topic,
      courseCode: selectedCourse,
      author: 'Admin User', // Mock current user
      role: 'Admin',
      date: 'Just now',
      content: newTopicData.content,
      replies: [],
      likes: 0,
      isPinned: false
    };
    setDiscussions([newDiscussion, ...discussions]);
    setIsModalOpen(false);
    setNewTopicData({ topic: '', content: '', attachments: null });
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion || !replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now(),
      author: 'Admin User',
      role: 'Admin',
      content: replyContent,
      date: 'Just now'
    };

    const updatedDiscussion = {
      ...selectedDiscussion,
      replies: [...selectedDiscussion.replies, newReply]
    };

    setDiscussions(discussions.map(d => d.id === selectedDiscussion.id ? updatedDiscussion : d));
    setSelectedDiscussion(updatedDiscussion);
    setReplyContent('');
  };

  const handleDeleteDiscussion = (id: number) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      setDiscussions(discussions.filter(d => d.id !== id));
      if (selectedDiscussion?.id === id) handleBackToList();
    }
  };

  const handlePinDiscussion = (id: number) => {
    setDiscussions(discussions.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d));
    if (selectedDiscussion?.id === id) {
      setSelectedDiscussion({ ...selectedDiscussion, isPinned: !selectedDiscussion.isPinned });
    }
  };

  // Filter discussions
  const filteredDiscussions = discussions.filter(d => 
    selectedCourse ? d.courseCode === selectedCourse : true
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-green-600" />
            Discussions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Collaborate and discuss with peers and lecturers.</p>
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
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Select a course to view discussions</h3>
          <p className="text-sm text-gray-400">Use the filters above to navigate to a specific course.</p>
        </div>
      ) : (
        <>
          {currentView === 'list' ? (
            /* Discussion List View */
            <div className="grid grid-cols-1 gap-4">
              {filteredDiscussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  onClick={() => handleOpenDiscussion(discussion)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        discussion.role === 'Lecturer' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-green-100 text-green-600'
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
                          <span>• {discussion.date}</span>
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
                          discussion.isPinned 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'hover:bg-gray-100 text-gray-400 hover:text-orange-500'
                        }`}
                        title="Pin Topic"
                      >
                        <Pin size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 ml-13 pl-13 mb-4 line-clamp-2">
                    {discussion.content}
                  </p>

                  <div className="flex items-center gap-6 ml-13 pl-13 text-sm text-gray-500">
                    <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <MessageCircle size={16} />
                      <span>{discussion.replies.length} Replies</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={16} />
                      <span>{discussion.likes} Likes</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDiscussions.length === 0 && (
                <div className="py-12 text-center text-gray-400 italic">
                  No discussions started yet for this course. Be the first to start one!
                </div>
              )}
            </div>
          ) : (
            /* Discussion Detail View */
            <div className="space-y-6">
              <button 
                onClick={handleBackToList}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={16} /> Back to Discussions
              </button>

              {selectedDiscussion && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  {/* Original Post */}
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
                            <span>• {selectedDiscussion.date}</span>
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

                    <div className="mt-4 flex items-center gap-4">
                       <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                         <ThumbsUp size={16} /> {selectedDiscussion.likes} Likes
                       </button>
                    </div>
                  </div>

                  {/* Replies */}
                  <div className="p-6 space-y-6">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageCircle size={18} /> {selectedDiscussion.replies.length} Replies
                    </h3>

                    {selectedDiscussion.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                          reply.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 
                          reply.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {reply.author.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl rounded-tl-none p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900 dark:text-white">{reply.author}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  reply.role === 'Lecturer' ? 'bg-purple-100 text-purple-600' : 
                                  reply.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                }`}>{reply.role}</span>
                              </div>
                              <span className="text-xs text-gray-400">{reply.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                            {reply.attachments && reply.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {reply.attachments.map((att, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-xs">
                                    <Paperclip size={14} className="text-gray-400" />
                                    <span className="font-medium text-blue-600 dark:text-blue-400">{att.name}</span>
                                    <span className="text-gray-400">({att.size})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 px-2">
                            <button className="text-xs font-medium text-gray-500 hover:text-blue-600">Like</button>
                            <button className="text-xs font-medium text-gray-500 hover:text-blue-600">Reply</button>
                            <button className="text-xs font-medium text-gray-400 hover:text-red-500 ml-auto">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handlePostReply} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        A
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

      {/* New Topic Modal */}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic Title</label>
                <input 
                  type="text" 
                  value={newTopicData.topic}
                  onChange={(e) => setNewTopicData({...newTopicData, topic: e.target.value})}
                  placeholder="e.g. Question about the final project"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea 
                  value={newTopicData.content}
                  onChange={(e) => setNewTopicData({...newTopicData, content: e.target.value})}
                  rows={5}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                  <input type="file" multiple className="hidden" id="topic-files" />
                  <label htmlFor="topic-files" className="cursor-pointer flex flex-col items-center">
                    <Paperclip size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to attach files</span>
                  </label>
                </div>
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20"
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;

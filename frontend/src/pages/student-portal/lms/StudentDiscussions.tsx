import React, { useState } from 'react';
import { 
  MessageSquare, 
  MessageCircle,
  ThumbsUp,
  BookOpen,
  ChevronLeft,
  User,
  Clock,
  Send
} from 'lucide-react';

const StudentDiscussions: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  // Mock Courses (Enrolled)
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'MTH 302', title: 'Linear Algebra' },
    { code: 'PHY 201', title: 'General Physics' }
  ];

  const discussions = [
    {
      id: 1,
      topic: 'Clarification on Week 2 Assignment',
      courseCode: 'CSC 401',
      author: 'John Doe',
      role: 'Student',
      date: '2 hours ago',
      replies: [
        { id: 101, author: 'Dr. Smith', role: 'Lecturer', content: 'Please refer to the rubric on page 3.', date: '1 hour ago' }
      ],
      likes: 12,
      content: 'I am a bit confused about the requirements for the third section of the assignment. Can anyone clarify if we need to include UML diagrams for the database schema?'
    },
    {
      id: 2,
      topic: 'Interesting Article on Quantum Computing',
      courseCode: 'CSC 401',
      author: 'Dr. A. Bello',
      role: 'Lecturer',
      date: '1 day ago',
      replies: [],
      likes: 24,
      content: 'Here is a link to a fascinating article I found regarding our discussion on quantum algorithms yesterday. Worth a read! [Link]'
    },
    {
      id: 3,
      topic: 'Lab Group Formation',
      courseCode: 'PHY 201',
      author: 'Lab Admin',
      role: 'Admin',
      date: '3 days ago',
      replies: [],
      likes: 5,
      content: 'Please form groups of 4 for the upcoming lab session.'
    }
  ];

  const filteredDiscussions = discussions.filter(d => 
    selectedCourse ? d.courseCode === selectedCourse : true
  );

  const handleViewDiscussion = (discussion: any) => {
    setSelectedDiscussion(discussion);
    setCurrentView('detail');
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // Mock reply
    const newReply = {
      id: Date.now(),
      author: 'Me',
      role: 'Student',
      content: replyText,
      date: 'Just now'
    };
    setSelectedDiscussion({
      ...selectedDiscussion,
      replies: [...selectedDiscussion.replies, newReply]
    });
    setReplyText('');
  };

  return (
    <div className="space-y-6 p-6">
      {currentView === 'list' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="text-green-600" />
                Discussions
              </h1>
              <p className="text-gray-500 dark:text-gray-400">Collaborate and discuss with peers and lecturers.</p>
            </div>

            {/* Course Filter */}
            <div className="relative min-w-[250px]">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              >
                <option value="">All My Courses</option>
                {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredDiscussions.length === 0 ? (
               <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                 <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                 <p className="text-gray-500 dark:text-gray-400 font-medium">No discussions found.</p>
               </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  onClick={() => handleViewDiscussion(discussion)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                        {discussion.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">{discussion.topic}</h3>
                           <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                             {discussion.courseCode}
                           </span>
                        </div>
                        <p className="text-xs text-gray-500">{discussion.author} ({discussion.role}) • {discussion.date}</p>
                      </div>
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
              ))
            )}
          </div>
        </>
      ) : (
        /* Detail View */
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ChevronLeft size={16} /> Back to Discussions
          </button>

          {selectedDiscussion && (
            <div className="space-y-6">
              {/* Main Topic */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                    {selectedDiscussion.author.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDiscussion.topic}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-green-600">{selectedDiscussion.author}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">{selectedDiscussion.role}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {selectedDiscussion.date}</span>
                    </div>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  <p>{selectedDiscussion.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                    <ThumbsUp size={16} /> Like ({selectedDiscussion.likes})
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium">
                    <MessageCircle size={16} /> Reply
                  </button>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4 pl-4 md:pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Replies ({selectedDiscussion.replies.length})</h3>
                
                {selectedDiscussion.replies.map((reply: any) => (
                  <div key={reply.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-300">
                        {reply.author.charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{reply.author}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          reply.role === 'Lecturer' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {reply.role}
                        </span>
                        <span className="text-xs text-gray-400">• {reply.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 ml-11">{reply.content}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handlePostReply} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky bottom-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <User size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none resize-none text-sm"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send size={16} /> Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDiscussions;

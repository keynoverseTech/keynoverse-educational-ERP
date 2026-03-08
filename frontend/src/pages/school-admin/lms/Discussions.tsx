import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  MessageCircle,
  ThumbsUp
} from 'lucide-react';

const Discussions: React.FC = () => {
  const discussions = [
    {
      id: 1,
      topic: 'Clarification on Week 2 Assignment',
      course: 'CSC 401',
      author: 'John Doe',
      date: '2 hours ago',
      replies: 5,
      likes: 12,
      preview: 'I am a bit confused about the requirements for the third section of the assignment. Can anyone clarify if we need to include...'
    },
    {
      id: 2,
      topic: 'Interesting Article on Quantum Computing',
      course: 'CSC 401',
      author: 'Dr. A. Bello',
      date: '1 day ago',
      replies: 8,
      likes: 24,
      preview: 'Here is a link to a fascinating article I found regarding our discussion on quantum algorithms yesterday. Worth a read!'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-green-600" />
            Discussions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Collaborate and discuss with peers and lecturers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-lg shadow-green-500/20">
          <Plus size={16} /> New Topic
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                  {discussion.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">{discussion.topic}</h3>
                  <p className="text-xs text-gray-500">{discussion.author} • {discussion.date} • <span className="font-medium text-green-600">{discussion.course}</span></p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-13 pl-13 mb-4 line-clamp-2">
              {discussion.preview}
            </p>

            <div className="flex items-center gap-6 ml-13 pl-13 text-sm text-gray-500">
              <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                <MessageCircle size={16} />
                <span>{discussion.replies} Replies</span>
              </div>
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <ThumbsUp size={16} />
                <span>{discussion.likes} Likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussions;
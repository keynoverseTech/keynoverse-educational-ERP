import React, { useState } from 'react';
import { 
  Inbox as InboxIcon, 
  Search, 
  Megaphone, 
  MessageSquare, 
  User, 
  Star,
  Trash2,
  Archive,
  Reply
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  type: 'announcement' | 'direct_message';
  date: string;
  isRead: boolean;
  isStarred: boolean;
  avatar?: string; // Initials or image URL
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'School Admin',
    subject: 'Semester Orientation',
    preview: 'All staff and students are invited to the semester orientation on Monday at 10:00am.',
    type: 'announcement',
    date: '10:00 AM',
    isRead: false,
    isStarred: true,
    avatar: 'SA'
  },
  {
    id: '2',
    sender: 'Dr. Alan Turing',
    subject: 'Project Submission Query',
    preview: 'Hello, I wanted to ask about the deadline for the final project submission...',
    type: 'direct_message',
    date: 'Yesterday',
    isRead: true,
    isStarred: false,
    avatar: 'AT'
  },
  {
    id: '3',
    sender: 'HR Department',
    subject: 'Policy Update',
    preview: 'Please review the updated leave policy attached to this email.',
    type: 'announcement',
    date: 'Jan 10',
    isRead: true,
    isStarred: false,
    avatar: 'HR'
  },
  {
    id: '4',
    sender: 'Sarah Jenkins',
    subject: 'Meeting Reschedule',
    preview: 'Can we move our meeting to next Tuesday instead?',
    type: 'direct_message',
    date: 'Jan 08',
    isRead: false,
    isStarred: true,
    avatar: 'SJ'
  }
];

const Inbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'announcement' | 'direct_message'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = MOCK_MESSAGES.filter(msg => {
    const matchesTab = activeTab === 'all' || msg.type === activeTab;
    const matchesSearch = 
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Sidebar / Message List */}
      <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <InboxIcon className="text-blue-600" /> Inbox
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {MOCK_MESSAGES.filter(m => !m.isRead).length} New
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex p-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            All Messages
          </button>
          <button 
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'announcement' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            <Megaphone size={12} /> Announcements
          </button>
          <button 
            onClick={() => setActiveTab('direct_message')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'direct_message' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            <MessageSquare size={12} /> Direct
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredMessages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedMessage?.id === msg.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''} ${!msg.isRead ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${msg.type === 'announcement' ? 'bg-purple-500' : 'bg-green-500'}`}>
                        {msg.avatar}
                      </div>
                      <div>
                        <h3 className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                          {msg.sender}
                        </h3>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          {msg.type === 'announcement' ? <Megaphone size={10} /> : <MessageSquare size={10} />}
                          {msg.type === 'announcement' ? 'Announcement' : 'Direct Message'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{msg.date}</span>
                  </div>
                  <h4 className={`text-sm mt-2 mb-1 truncate ${!msg.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {msg.preview}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
              <InboxIcon size={48} className="mb-2 opacity-20" />
              <p>No messages found</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex-col overflow-hidden`}>
        {selectedMessage ? (
          <>
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
              >
                ← Back
              </button>
              <div className="flex gap-2 ml-auto">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Reply">
                  <Reply size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Archive">
                  <Archive size={18} />
                </button>
                <button className="p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg text-gray-500 transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md ${selectedMessage.type === 'announcement' ? 'bg-purple-500' : 'bg-green-500'}`}>
                    {selectedMessage.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-gray-300">{selectedMessage.sender}</span>
                      <span>•</span>
                      <span>{selectedMessage.date}</span>
                    </div>
                  </div>
                </div>
                {selectedMessage.isStarred && (
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="whitespace-pre-wrap">{selectedMessage.preview}</p>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mt-4">
                  Best regards,<br />
                  {selectedMessage.sender}
                </p>
              </div>
            </div>
            
            {/* Reply Box (Placeholder) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <textarea 
                    placeholder="Click to reply..." 
                    rows={1}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-12 text-center bg-gray-50/50 dark:bg-gray-800/20">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-500">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a message</h3>
            <p className="max-w-xs mx-auto">Choose a message from the list to view details or reply.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
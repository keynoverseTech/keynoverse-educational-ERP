import React, { useState } from 'react';
import { 
  Inbox as InboxIcon, 
  Search, 
  Megaphone, 
  MessageSquare, 
  Trash2,
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
  avatar?: string;
  body?: string;
}

const StaffInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'announcement' | 'direct_message'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  // Mock Messages for Staff
  const MESSAGES: Message[] = [
    {
      id: '1',
      sender: 'HOD - Computer Science',
      subject: 'Department Meeting',
      preview: 'Reminder: Department meeting scheduled for Wednesday at 2 PM.',
      type: 'announcement',
      date: '10:00 AM',
      isRead: false,
      avatar: 'CS',
      body: 'Dear Staff,\n\nThis is a reminder that our monthly department meeting will be held this Wednesday at 2:00 PM in the Conference Room. Please ensure you have updated your course files before then.\n\nRegards,\nDr. Alan Turing\nHOD'
    },
    {
      id: '2',
      sender: 'John Doe (Student)',
      subject: 'Question about Assignment 3',
      preview: 'Hello Dr. Sarah, I am having trouble understanding the requirements for...',
      type: 'direct_message',
      date: 'Yesterday',
      isRead: true,
      avatar: 'JD',
      body: 'Hello Dr. Sarah,\n\nI am having trouble understanding the requirements for Assignment 3, specifically regarding the database schema design. Could we schedule a brief time to discuss during your office hours?\n\nThanks,\nJohn Doe\nCSC 301'
    },
    {
      id: '3',
      sender: 'School Admin',
      subject: 'Public Holiday Notice',
      preview: 'The university will be closed on Friday for the public holiday.',
      type: 'announcement',
      date: 'Jan 15',
      isRead: true,
      avatar: 'SA',
      body: 'Dear All,\n\nPlease be informed that the university will be closed this Friday in observance of the public holiday. Classes will resume on Monday.\n\nManagement'
    }
  ];

  const filteredMessages = MESSAGES.filter(msg => {
    const matchesTab = activeTab === 'all' || msg.type === activeTab;
    const matchesSearch = 
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleReply = () => {
    if (!replyText.trim()) return;
    alert(`Reply sent to ${selectedMessage?.sender}`);
    setReplyText('');
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-6">
      {/* Message List */}
      <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <InboxIcon className="text-blue-600" /> Inbox
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {MESSAGES.filter(m => !m.isRead).length} New
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex p-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'announcement' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            <Megaphone size={12} /> Announcements
          </button>
          <button 
            onClick={() => setActiveTab('direct_message')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'direct_message' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500'}`}
          >
            <MessageSquare size={12} /> Direct
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map(msg => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${msg.type === 'announcement' ? 'bg-purple-500' : 'bg-green-500'}`}>
                    {msg.avatar}
                  </div>
                  <span className={`text-sm font-bold ${!msg.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {msg.sender}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{msg.date}</span>
              </div>
              <h4 className={`text-sm mb-1 truncate ${!msg.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {msg.subject}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {msg.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail */}
      <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex-col overflow-hidden`}>
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${selectedMessage.type === 'announcement' ? 'bg-purple-500' : 'bg-green-500'}`}>
                    {selectedMessage.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedMessage.sender}</p>
                    <p className="text-xs text-gray-500">{selectedMessage.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg lg:hidden"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.body || selectedMessage.preview}
              </p>
            </div>

            {selectedMessage.type === 'direct_message' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex gap-2">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..." 
                    rows={1}
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  ></textarea>
                  <button 
                    onClick={handleReply}
                    className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Reply size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-12 text-center">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffInbox;

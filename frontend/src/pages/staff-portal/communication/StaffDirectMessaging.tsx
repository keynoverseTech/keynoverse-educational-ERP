import React, { useState } from 'react';
import { Send, Search, MessageSquare, User, Users } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

interface Recipient {
  id: string;
  name: string;
  type: 'Student' | 'Staff' | 'Group';
  detail: string;
}

const StaffDirectMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Student' | 'Staff' | 'Group'>('Student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Mock Recipients
  const assignedCourses = getAssignedCourses();
  const students: Recipient[] = [
    { id: '1', name: 'John Doe', type: 'Student', detail: 'CSC 301 - Operating Systems' },
    { id: '2', name: 'Jane Smith', type: 'Student', detail: 'CSC 305 - Database Management' },
    { id: '3', name: 'Michael Johnson', type: 'Student', detail: 'CSC 301 - Operating Systems' },
  ];

  const staff: Recipient[] = [
    { id: '4', name: 'Dr. Alan Turing', type: 'Staff', detail: 'HOD - Computer Science' },
    { id: '5', name: 'Prof. Ada Lovelace', type: 'Staff', detail: 'Senior Lecturer' },
  ];

  const groups: Recipient[] = assignedCourses.map(course => ({
    id: course.id,
    name: `${course.code} Students`,
    type: 'Group',
    detail: `${course.title} Class Group`
  }));

  const recipients = activeTab === 'Student' ? students : activeTab === 'Staff' ? staff : groups;

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.detail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedRecipient) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'Me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Thanks for your message regarding ${selectedRecipient.name}.`,
        sender: selectedRecipient.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-6">
      {/* Sidebar - Recipients */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <MessageSquare className="text-blue-600" /> Direct Messages
          </h1>
          
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1 mb-4">
            {['Student', 'Staff', 'Group'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredRecipients.map(recipient => (
            <div
              key={recipient.id}
              onClick={() => {
                setSelectedRecipient(recipient);
                setMessages([]); // Clear messages for demo
              }}
              className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
                selectedRecipient?.id === recipient.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                recipient.type === 'Group' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {recipient.type === 'Group' ? <Users size={18} /> : recipient.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{recipient.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{recipient.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden lg:flex flex-1 flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {selectedRecipient ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-900/20">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                selectedRecipient.type === 'Group' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {selectedRecipient.type === 'Group' ? <Users size={18} /> : selectedRecipient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedRecipient.name}</h2>
                <p className="text-xs text-gray-500">{selectedRecipient.detail}</p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30 dark:bg-gray-900/10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageSquare size={48} className="mb-2 opacity-20" />
                  <p>Start a conversation with {selectedRecipient.name}</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.sender === 'Me' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.sender === 'Me' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Send size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your Messages</h3>
            <p className="max-w-xs mx-auto text-sm">Select a student, staff member, or group to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDirectMessaging;

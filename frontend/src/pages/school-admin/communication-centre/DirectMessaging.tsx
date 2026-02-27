import React, { useMemo, useState } from 'react';
import { MessageSquare, Send, Search, Filter, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';

type RecipientType = 'Staff' | 'Students' | 'Group';

interface Recipient {
  id: string;
  name: string;
  type: 'Staff' | 'Student';
  detail: string;
}

interface MessageThread {
  id: string;
  subject: string;
  recipients: string[];
  sentBy: string;
  createdAt: string;
}

const DirectMessaging: React.FC = () => {
  const { staff } = useHR();
  const [recipientType, setRecipientType] = useState<RecipientType>('Staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('All Staff');
  const [threads, setThreads] = useState<MessageThread[]>([
    {
      id: 'msg_1',
      subject: 'Department Meeting',
      recipients: ['Academic Staff'],
      sentBy: 'Admin',
      createdAt: '2026-01-20T09:30:00.000Z'
    },
    {
      id: 'msg_2',
      subject: 'Project Submission Reminder',
      recipients: ['ENG/2021/001', 'SCI/2022/045'],
      sentBy: 'HOD',
      createdAt: '2026-01-18T13:45:00.000Z'
    }
  ]);

  const studentRecipients: Recipient[] = [
    { id: 'stu_1', name: 'Alex Johnson', type: 'Student', detail: 'ENG/2021/001' },
    { id: 'stu_2', name: 'Sarah Williams', type: 'Student', detail: 'SCI/2022/045' },
    { id: 'stu_3', name: 'Michael Brown', type: 'Student', detail: 'MED/2020/112' }
  ];

  const staffRecipients: Recipient[] = staff.map(member => ({
    id: member.id,
    name: `${member.firstName} ${member.lastName}`,
    type: 'Staff',
    detail: member.staffId
  }));

  const recipients = recipientType === 'Staff' ? staffRecipients : studentRecipients;

  const filteredRecipients = useMemo(() => {
    return recipients.filter(recipient =>
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.detail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipients, searchQuery]);

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    if (recipientType !== 'Group' && selectedRecipientIds.length === 0) return;

    const recipientLabels = recipientType === 'Group'
      ? [selectedGroup]
      : recipients
          .filter(r => selectedRecipientIds.includes(r.id))
          .map(r => r.detail);

    const newThread: MessageThread = {
      id: `msg_${crypto.randomUUID()}`,
      subject,
      recipients: recipientLabels,
      sentBy: 'Admin',
      createdAt: new Date().toISOString()
    };

    setThreads(prev => [newThread, ...prev]);
    setSubject('');
    setMessage('');
    setSelectedRecipientIds([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            Direct Messaging
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Send targeted messages to individuals or filtered groups across staff and students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-xl shadow-gray-200/30">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Compose Message</h2>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Staff', 'Students', 'Group'] as RecipientType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRecipientType(type);
                        setSelectedRecipientIds([]);
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                        recipientType === type
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white dark:bg-gray-900 border-gray-50 dark:border-gray-700 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {recipientType === 'Group' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Group</label>
                  <select
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                  >
                    <option>All Staff</option>
                    <option>Academic Staff</option>
                    <option>Administrative Staff</option>
                    <option>All Students</option>
                    <option>Level 100</option>
                    <option>Level 200</option>
                    <option>Level 300</option>
                    <option>Level 400</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipients</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder={`Search ${recipientType.toLowerCase()}...`}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredRecipients.map(recipient => (
                      <button
                        key={recipient.id}
                        type="button"
                        onClick={() => toggleRecipient(recipient.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                          selectedRecipientIds.includes(recipient.id)
                            ? 'bg-emerald-50 border-emerald-400'
                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{recipient.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{recipient.detail}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${selectedRecipientIds.includes(recipient.id) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  placeholder="Message subject"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-emerald-500 outline-none transition-all font-bold"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-emerald-500 outline-none transition-all font-bold min-h-[140px] resize-none"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <Filter size={14} />
              Recent Messages
            </div>
          </div>

          <div className="space-y-4">
            {threads.length > 0 ? (
              threads.map(thread => (
                <div key={thread.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">{thread.subject}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {thread.recipients.map((recipient, idx) => (
                          <span key={idx} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                            {recipient}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <User size={12} /> {thread.sentBy}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Delivered
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Messages</h3>
                <p className="text-sm text-gray-500">Start a direct message to reach staff or students.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessaging;

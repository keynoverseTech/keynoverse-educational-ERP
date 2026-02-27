import React, { useMemo, useState } from 'react';
import { Megaphone, Send, Users, Search, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string[];
  sender: string;
  createdAt: string;
}

const Announcements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendToStaff, setSendToStaff] = useState(true);
  const [sendToStudents, setSendToStudents] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann_1',
      title: 'Semester Orientation',
      message: 'All staff and students are invited to the semester orientation on Monday at 10:00am.',
      audience: ['Staff', 'Students'],
      sender: 'School Admin',
      createdAt: '2026-01-12T09:00:00.000Z'
    },
    {
      id: 'ann_2',
      title: 'Facilities Maintenance',
      message: 'Power maintenance will run from 2:00pm to 6:00pm today.',
      audience: ['Staff'],
      sender: 'School Admin',
      createdAt: '2026-01-10T14:00:00.000Z'
    }
  ]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [announcements, searchQuery]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const audience = [
      ...(sendToStaff ? ['Staff'] : []),
      ...(sendToStudents ? ['Students'] : [])
    ];

    if (audience.length === 0) return;

    const newAnnouncement: Announcement = {
      id: `ann_${crypto.randomUUID()}`,
      title,
      message,
      audience,
      sender: 'School Admin',
      createdAt: new Date().toISOString()
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            Announcements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Broadcast important updates to staff, students, or the whole school.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <Users size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Audience: {sendToStaff && sendToStudents ? 'Staff + Students' : sendToStaff ? 'Staff' : sendToStudents ? 'Students' : 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-xl shadow-gray-200/30">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Create Announcement</h2>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  placeholder="Announcement title"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                <textarea
                  placeholder="Write your announcement..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold min-h-[140px] resize-none"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Send To</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={sendToStaff}
                      onChange={() => setSendToStaff(prev => !prev)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Staff
                  </label>
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={sendToStudents}
                      onChange={() => setSendToStudents(prev => !prev)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Students
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send size={16} /> Send Announcement
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{item.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                        {item.audience.join(' + ')}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Sent by {item.sender}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Announcements</h3>
                <p className="text-sm text-gray-500">Create your first announcement to notify the school.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;

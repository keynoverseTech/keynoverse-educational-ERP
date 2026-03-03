import React, { useState } from 'react';
import { Send, Users, CheckCircle } from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';

const AlumniCommunication: React.FC = () => {
  const { alumni } = useAlumni();
  const [recipientType, setRecipientType] = useState('All');
  const [yearFilter, setYearFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const uniqueYears = [...new Set(alumni.map(s => s.graduationYear))].sort((a, b) => b - a);
  const uniquePrograms = [...new Set(alumni.map(s => s.program))].sort();

  const recipientCount = alumni.filter(s => {
    if (recipientType === 'All') return true;
    if (recipientType === 'Year') return s.graduationYear.toString() === yearFilter;
    if (recipientType === 'Program') return s.program === programFilter;
    return true;
  }).length;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log({ recipientType, yearFilter, programFilter, subject, message });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Communication</h1>
          <p className="text-gray-500 dark:text-gray-400">Send updates and newsletters to alumni</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <form onSubmit={handleSend} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Send size={20} className="text-blue-500" />
                    Compose Message
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipients</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select 
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                            >
                                <option value="All">All Alumni</option>
                                <option value="Year">By Graduation Year</option>
                                <option value="Program">By Programme</option>
                            </select>

                            {recipientType === 'Year' && (
                                <select 
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 animate-in fade-in"
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            )}

                            {recipientType === 'Program' && (
                                <select 
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 animate-in fade-in"
                                    value={programFilter}
                                    onChange={(e) => setProgramFilter(e.target.value)}
                                    required
                                >
                                    <option value="">Select Program</option>
                                    {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <Users size={12} />
                            Will be sent to {recipientCount} recipients
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subject line..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea 
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        {sent && (
                            <span className="text-emerald-600 flex items-center gap-2 text-sm font-medium animate-in fade-in">
                                <CheckCircle size={16} /> Message sent successfully!
                            </span>
                        )}
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                    <li>Use clear and concise subject lines.</li>
                    <li>Target specific graduation years for reunions.</li>
                    <li>Share job opportunities with relevant programs.</li>
                    <li>Keep alumni updated on school achievements.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCommunication;

import React, { useState } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { useReception } from '../../../state/receptionContext';
import type { Mail } from '../../../state/receptionContext';

const MailLog: React.FC = () => {
  const { mails, setMails } = useReception();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [formData, setFormData] = useState({
    type: 'Incoming',
    sender: '',
    recipient: '',
    referenceNumber: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMail: Mail = {
      id: Date.now().toString(),
      ...formData,
      type: formData.type as 'Incoming' | 'Outgoing',
      status: formData.type === 'Incoming' ? 'Received' : 'Dispatched',
      date: new Date().toISOString().split('T')[0]
    };
    setMails([newMail, ...mails]);
    setIsModalOpen(false);
    setFormData({ type: 'Incoming', sender: '', recipient: '', referenceNumber: '', description: '' });
  };

  const updateStatus = (id: string, status: 'Delivered' | 'Dispatched') => {
    setMails(prev => prev.map(m => 
      m.id === id ? { ...m, status } : m
    ));
  };

  const filteredMails = mails.filter(m => {
    const matchesSearch = 
      m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.referenceNumber && m.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'All' ? true : m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mail Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Track incoming and outgoing mail and packages</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Register Mail
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by sender, recipient, or reference..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'All' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Incoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'Incoming' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            Incoming
          </button>
          <button
            onClick={() => setFilterType('Outgoing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'Outgoing' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            Outgoing
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMails.map(mail => (
          <div key={mail.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  mail.type === 'Incoming' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {mail.type === 'Incoming' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {mail.type === 'Incoming' ? `From: ${mail.sender}` : `To: ${mail.recipient}`}
                    {mail.referenceNumber && (
                      <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                        #{mail.referenceNumber}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500">{mail.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                mail.status === 'Delivered' || mail.status === 'Dispatched' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {mail.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{mail.description}</p>
            <p className="text-xs text-gray-400 mb-4">
              {mail.type === 'Incoming' ? `Recipient: ${mail.recipient}` : `Sender: ${mail.sender}`}
            </p>

            {mail.status === 'Received' && (
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => updateStatus(mail.id, 'Delivered')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <FileText size={14} /> Mark Delivered
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredMails.length === 0 && (
          <div className="text-center py-12 text-gray-500">No mail records found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Register Mail</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Incoming' })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'Incoming' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Incoming
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Outgoing' })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'Outgoing' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Outgoing
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ref Number (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailLog;

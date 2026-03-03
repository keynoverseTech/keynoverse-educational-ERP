import React, { useState } from 'react';
import { HelpCircle, Plus, Search, Phone, Users, Mail } from 'lucide-react';
import { useReception } from '../../../state/receptionContext';
import type { Enquiry } from '../../../state/receptionContext';

const EnquiriesLog: React.FC = () => {
  const { enquiries, setEnquiries } = useReception();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    medium: 'Phone',
    subject: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnquiry: Enquiry = {
      id: Date.now().toString(),
      ...formData,
      medium: formData.medium as 'Phone' | 'Walk-in' | 'Email',
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setEnquiries([newEnquiry, ...enquiries]);
    setIsModalOpen(false);
    setFormData({ name: '', contact: '', medium: 'Phone', subject: '', details: '' });
  };

  const updateStatus = (id: string, status: 'Closed' | 'Follow-up') => {
    setEnquiries(prev => prev.map(e => 
      e.id === id ? { ...e, status } : e
    ));
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMediumIcon = (medium: string) => {
    switch (medium) {
      case 'Phone': return <Phone size={16} />;
      case 'Walk-in': return <Users size={16} />;
      case 'Email': return <Mail size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enquiries Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Record and track general enquiries</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Enquiry
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search enquiries..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEnquiries.map(enquiry => (
          <div key={enquiry.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  enquiry.medium === 'Phone' ? 'bg-purple-100 text-purple-600' :
                  enquiry.medium === 'Walk-in' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {getMediumIcon(enquiry.medium)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{enquiry.subject}</h3>
                  <p className="text-xs text-gray-500">{enquiry.name} • {enquiry.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                enquiry.status === 'Open' ? 'bg-green-100 text-green-700' :
                enquiry.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {enquiry.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{enquiry.details}</p>
            <p className="text-xs text-gray-400 mb-4">Contact: {enquiry.contact}</p>

            {enquiry.status === 'Open' && (
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => updateStatus(enquiry.id, 'Follow-up')}
                  className="px-3 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  Mark Follow-up
                </button>
                <button
                  onClick={() => updateStatus(enquiry.id, 'Closed')}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close Enquiry
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500">No enquiries found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Log New Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medium</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  >
                    <option value="Phone">Phone</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Info</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
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
                  Log Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesLog;

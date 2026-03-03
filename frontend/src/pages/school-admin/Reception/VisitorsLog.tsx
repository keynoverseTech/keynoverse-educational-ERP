import React, { useState } from 'react';
import { UserPlus, Search, LogOut, Clock } from 'lucide-react';
import { useReception } from '../../../state/receptionContext';
import type { Visitor } from '../../../state/receptionContext';

const VisitorsLog: React.FC = () => {
  const { visitors, setVisitors } = useReception();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    personToSee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      ...formData,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    setVisitors([newVisitor, ...visitors]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', purpose: '', personToSee: '' });
  };

  const handleCheckOut = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : v
    ));
  };

  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visitors Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage daily visitor check-ins and check-outs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Register Visitor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search visitors..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Visitor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Purpose</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Visiting</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Time</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredVisitors.map(visitor => (
              <tr key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-white">{visitor.name}</p>
                  <p className="text-xs text-gray-500">{visitor.phone}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{visitor.purpose}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{visitor.personToSee}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <Clock size={12} /> In: {visitor.checkInTime}
                    </span>
                    {visitor.checkOutTime ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <LogOut size={12} /> Out: {visitor.checkOutTime}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Active</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {!visitor.checkOutTime && (
                    <button
                      onClick={() => handleCheckOut(visitor.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredVisitors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No visitors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Register New Visitor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Person to See</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.personToSee}
                  onChange={(e) => setFormData({ ...formData, personToSee: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of Visit</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
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
                  Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorsLog;

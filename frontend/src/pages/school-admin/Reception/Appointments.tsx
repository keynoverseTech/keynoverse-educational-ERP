import React, { useState } from 'react';
import { Calendar, Plus, Check, X, Search, Clock } from 'lucide-react';
import { useReception } from '../../../state/receptionContext';
import type { Appointment } from '../../../state/receptionContext';

const Appointments: React.FC = () => {
  const { appointments, setAppointments } = useReception();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    visitorName: '',
    date: '',
    time: '',
    purpose: '',
    personToSee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'Scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    setIsModalOpen(false);
    setFormData({ visitorName: '', date: '', time: '', purpose: '', personToSee: '' });
  };

  const updateStatus = (id: string, status: 'Arrived' | 'Cancelled') => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const filteredAppointments = appointments.filter(a => 
    a.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.personToSee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule and manage visitor appointments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by visitor or staff name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments.map(app => (
          <div key={app.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{app.visitorName}</h3>
                  <p className="text-xs text-gray-500">Meeting: {app.personToSee}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                app.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                app.status === 'Arrived' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {app.status}
              </span>
            </div>

            <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                {app.date} at {app.time}
              </div>
              <p className="italic">"{app.purpose}"</p>
            </div>

            {app.status === 'Scheduled' && (
              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => updateStatus(app.id, 'Cancelled')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'Arrived')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Check size={16} /> Arrived
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredAppointments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No appointments found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Schedule Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visitor Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting With</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.personToSee}
                  onChange={(e) => setFormData({ ...formData, personToSee: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose</label>
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

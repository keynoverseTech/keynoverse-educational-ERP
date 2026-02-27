import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Type, FileText, Image as ImageIcon, Paperclip, Plus } from 'lucide-react';
import { useEvents } from '../../../state/eventsContext';
import { useNavigate } from 'react-router-dom';

const CreateEvent: React.FC = () => {
  const { categories, addEvent } = useEvents();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    time: '',
    venue: '',
    targetAudience: '',
    capacity: 0,
    bannerUrl: null as File | null,
    documentUrl: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      ...formData,
      bannerUrl: formData.bannerUrl ? URL.createObjectURL(formData.bannerUrl) : null,
      documentUrl: formData.documentUrl ? URL.createObjectURL(formData.documentUrl) : null
    });
    navigate('/school-admin/events/upcoming');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Plus className="w-6 h-6 text-white" />
            </div>
            Create New Event
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Fill in the details below to schedule a new event.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-4">Event Details</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Event Title</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
              <select 
                required
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Target Audience</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.targetAudience}
                  onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="e.g. Students, Staff, Parents"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
              <textarea 
                required
                rows={4}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the event..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-4">Date & Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="time"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Venue</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                  placeholder="e.g. School Hall"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Capacity (Optional)</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="number"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.capacity || ''}
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  placeholder="Max attendees"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-4">Attachments</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Event Banner (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="file"
                  accept="image/*"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  onChange={e => setFormData({...formData, bannerUrl: e.target.files?.[0] || null})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Document (Optional)</label>
              <div className="relative">
                <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  onChange={e => setFormData({...formData, documentUrl: e.target.files?.[0] || null})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            type="button"
            onClick={() => navigate('/school-admin/events/upcoming')}
            className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-4 bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-all active:scale-95"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

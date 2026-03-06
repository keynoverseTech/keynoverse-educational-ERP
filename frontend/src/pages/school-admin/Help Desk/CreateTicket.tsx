import React, { useState } from 'react';
import { Send, FileText, Paperclip, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHelpDesk } from '../../../state/helpdeskContext';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { categories, createTicket } = useHelpDesk();
  const [formData, setFormData] = useState({
    categoryId: '',
    subject: '',
    description: '',
    priority: 'Low',
    isAnonymous: false,
    hasAttachment: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      ...formData,
      priority: formData.priority as 'Low' | 'Medium' | 'High',
      isAnonymous: formData.isAnonymous,
      hasAttachment: formData.hasAttachment
    });
    alert('Ticket submitted successfully!');
    navigate('/school-admin/helpdesk/tickets');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Ticket</h1>
          <p className="text-gray-500 dark:text-gray-400">Report an issue or request support</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed explanation of the problem..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachment (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFormData({ ...formData, hasAttachment: !!e.target.files?.length })}
                />
                <Paperclip className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.hasAttachment ? 'File Selected' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-gray-900 dark:text-white text-sm">Anonymous Submission</label>
                  <div 
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.isAnonymous ? 'bg-blue-600' : 'bg-gray-300'}`}
                    onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.isAnonymous ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  If enabled, your identity will be hidden from support staff. However, we won't be able to contact you directly for follow-ups.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
            >
              <Send size={18} /> Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;

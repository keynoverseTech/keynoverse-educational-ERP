import React, { useState } from 'react';
import { Calendar, Upload, Send, AlertCircle } from 'lucide-react';
import { useHR, type LeaveRequest as LeaveRequestType } from '../../../state/hrAccessControl';

const LeaveRequest: React.FC = () => {
  const { staff, leaveTypes, setLeaveRequests } = useHR();
  
  // Simulation: defaulting to the first staff member as the "logged in" user
  // In a real app, this would come from auth context
  const [currentStaffId, setCurrentStaffId] = useState(staff[0]?.id || '');
  
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const selectedType = leaveTypes.find(t => t.id === formData.leaveTypeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) return;

    const newRequest: LeaveRequestType = {
      id: `req_${Date.now()}`,
      staffId: currentStaffId,
      leaveTypeId: formData.leaveTypeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      attachment: formData.attachment,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
        attachment: ''
      });
    }, 2000);
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          Request Leave
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Submit a new leave request for approval
        </p>
      </div>

      {/* Simulation Selector */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
        <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
        <div className="flex-1">
          <label className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase">Simulating As</label>
          <select 
            value={currentStaffId}
            onChange={e => setCurrentStaffId(e.target.value)}
            className="mt-1 block w-full bg-transparent border-none p-0 text-sm font-medium text-gray-900 dark:text-white focus:ring-0 cursor-pointer"
          >
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.staffId})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request Submitted!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your leave request has been sent for approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
              <select
                value={formData.leaveTypeId}
                onChange={e => setFormData({ ...formData, leaveTypeId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                required
              >
                <option value="">Select leave type...</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Max {type.maxDays} days)
                  </option>
                ))}
              </select>
              {selectedType && (
                <p className="mt-2 text-xs text-gray-500 flex gap-2">
                  {selectedType.carryForward && <span className="text-green-600">✓ Carries Forward</span>}
                  {selectedType.requiresAttachment && <span className="text-blue-600">ℹ Attachment Required</span>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200 font-medium text-center">
                Total Duration: {calculateDays()} Days
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
              <textarea
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="Please describe why you need this leave..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attachment {selectedType?.requiresAttachment && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;

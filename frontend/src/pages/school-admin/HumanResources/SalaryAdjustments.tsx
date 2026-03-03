import React, { useState } from 'react';
import { DollarSign, Plus, Check, X, FileText, Search } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';
import type { SalaryAdjustmentRequest, Staff } from '../../../state/hrAccessControl';

const SalaryAdjustments: React.FC = () => {
  const { salaryAdjustments, setSalaryAdjustments, staff } = useHR() as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    currentSalary: '',
    requestedSalary: '',
    reason: ''
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: SalaryAdjustmentRequest = {
      id: `adj_${Date.now()}`,
      staffId: formData.staffId,
      currentSalary: Number(formData.currentSalary),
      requestedSalary: Number(formData.requestedSalary),
      reason: formData.reason,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setSalaryAdjustments([...salaryAdjustments, newRequest]);
    setIsModalOpen(false);
    setFormData({ staffId: '', currentSalary: '', requestedSalary: '', reason: '' });
  };

  const handleStatusUpdate = (id: string, status: 'Approved' | 'Rejected') => {
    setSalaryAdjustments((prev: SalaryAdjustmentRequest[]) => prev.map((req: SalaryAdjustmentRequest) => 
      req.id === id ? { ...req, status, approvalDate: new Date().toISOString().split('T')[0] } : req
    ));
  };

  const filteredRequests = salaryAdjustments.filter((req: any) => {
    const staffMember = staff.find((s: Staff) => s.id === req.staffId);
    const matchesSearch = staffMember 
      ? `${staffMember.firstName} ${staffMember.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesStatus = filterStatus === 'All' ? true : req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Salary Adjustments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage staff salary increment requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by staff name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((req: any) => {
          const staffMember = staff.find((s: Staff) => s.id === req.staffId);
          return (
            <div key={req.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {staffMember?.firstName} {staffMember?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{staffMember?.staffId} • {req.requestDate}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Current Salary</span>
                  <p className="font-mono font-semibold text-gray-900 dark:text-white mt-1">
                    ${req.currentSalary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Requested Salary</span>
                  <p className="font-mono font-bold text-blue-600 mt-1">
                    ${req.requestedSalary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Increment</span>
                  <p className="font-mono font-semibold text-green-600 mt-1">
                    +${(req.requestedSalary - req.currentSalary).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{req.reason}"</p>
              </div>

              {req.status === 'Pending' && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'Approved')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Check size={16} /> Approve
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No requests found</h3>
            <p className="text-gray-500">No salary adjustment requests match your filters</p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Request Salary Adjustment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Member</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                >
                  <option value="">Select Staff</option>
                  {staff.map((s: Staff) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.staffId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Salary</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.currentSalary}
                    onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requested Salary</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.requestedSalary}
                    onChange={(e) => setFormData({ ...formData, requestedSalary: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Adjustment</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Performance review, promotion, market adjustment..."
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryAdjustments;

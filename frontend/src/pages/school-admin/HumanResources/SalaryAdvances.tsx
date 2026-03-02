import React, { useState } from 'react';
import { Plus, FileText, Search, CreditCard } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';
import type { SalaryAdvanceRequest, Staff } from '../../../state/hrAccessControl';

const SalaryAdvances: React.FC = () => {
  const { salaryAdvances, setSalaryAdvances, staff } = useHR() as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    amount: '',
    repaymentMonths: '1',
    reason: ''
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: SalaryAdvanceRequest = {
      id: `adv_${Date.now()}`,
      staffId: formData.staffId,
      amount: Number(formData.amount),
      repaymentMonths: Number(formData.repaymentMonths),
      reason: formData.reason,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setSalaryAdvances([...salaryAdvances, newRequest]);
    setIsModalOpen(false);
    setFormData({ staffId: '', amount: '', repaymentMonths: '1', reason: '' });
  };

  const handleStatusUpdate = (id: string, status: 'Approved' | 'Rejected') => {
    setSalaryAdvances((prev: SalaryAdvanceRequest[]) => prev.map((req: SalaryAdvanceRequest) => 
      req.id === id ? { ...req, status, approvalDate: new Date().toISOString().split('T')[0] } : req
    ));
  };

  const filteredRequests = salaryAdvances.filter((req: any) => {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Salary Advances</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage short-term staff loans</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Request Advance
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.map((req: any) => {
          const staffMember = staff.find((s: Staff) => s.id === req.staffId);
          return (
            <div key={req.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {staffMember?.firstName} {staffMember?.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{req.requestDate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  ${req.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">To be repaid over {req.repaymentMonths} months</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg mb-4 flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300">"{req.reason}"</p>
              </div>

              {req.status === 'Pending' && (
                <div className="flex gap-2 justify-end mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                    className="flex-1 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'Approved')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filteredRequests.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No requests found</h3>
            <p className="text-gray-500">No salary advance requests match your filters</p>
          </div>
        )}
      </div>

      {/* New Advance Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Request Salary Advance</h2>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Requested</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repayment (Months)</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.repaymentMonths}
                    onChange={(e) => setFormData({ ...formData, repaymentMonths: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6].map(m => (
                      <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Advance</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Medical emergency, personal expense..."
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

export default SalaryAdvances;

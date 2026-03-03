import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShoppingCart
} from 'lucide-react';
import { procurementService } from './service';
import type { PurchaseRequest } from './types';

const PurchaseRequests: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setRequests(procurementService.getRequests());
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      req.status = newStatus;
      if (newStatus === 'Approved') req.approvalDate = new Date().toISOString();
      procurementService.saveRequest(req);
      loadRequests();
    }
  };

  const filteredRequests = requests.filter(r => 
    filter === 'All' ? true : r.status === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="text-blue-600" />
            Purchase Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and approve internal requisition orders.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Submitted', 'Approved', 'Rejected', 'Ordered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              filter === status
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-[#151e32] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID / Requester</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Items</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Cost</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white">{req.id}</div>
                  <div className="text-xs text-gray-500">{req.requesterName} • {req.department}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(req.requestDate).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {req.items[0]?.itemName} 
                    {req.items.length > 1 && <span className="text-gray-400 text-xs ml-1">+{req.items.length - 1} more</span>}
                  </div>
                  <div className="text-xs text-gray-500">{req.items[0]?.justification}</div>
                </td>
                <td className="p-4 font-bold text-gray-900 dark:text-white">
                  ${req.totalEstimatedCost.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1 ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    req.status === 'Ordered' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {req.status === 'Approved' && <CheckCircle size={12} />}
                    {req.status === 'Rejected' && <XCircle size={12} />}
                    {req.status === 'Ordered' && <ShoppingCart size={12} />}
                    {req.status === 'Submitted' && <Clock size={12} />}
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {req.status === 'Submitted' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(req.id, 'Approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(req.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {req.status === 'Approved' && (
                      <button 
                        onClick={() => handleStatusChange(req.id, 'Ordered')} // Simplification for demo
                        className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700"
                      >
                        Create PO
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Create Modal (Inline for demo) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">New Purchase Request</h2>
            <p className="text-gray-500 mb-6">Create a new requisition for approval.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  procurementService.saveRequest({
                    id: `PR-${Date.now()}`,
                    requesterName: 'Admin User',
                    department: 'Management',
                    requestDate: new Date().toISOString(),
                    status: 'Submitted',
                    totalEstimatedCost: 500,
                    items: [{ itemName: 'New Laptop', quantity: 1, estimatedCost: 500, justification: 'Replacement' }]
                  });
                  loadRequests();
                  setIsCreateModalOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;

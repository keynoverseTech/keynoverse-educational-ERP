import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShoppingCart,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { procurementService } from './service';
import type { PurchaseRequest } from './types';

const PurchaseRequests: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState<{ isOpen: boolean, pr?: PurchaseRequest }>({ isOpen: false });
  const [expandedPR, setExpandedPR] = useState<string | null>(null);

  // New Request Form State
  const [newRequest, setNewRequest] = useState({
    requesterName: '',
    department: '',
    items: [{ itemName: '', quantity: 1, estimatedCost: 0, justification: '' }]
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setRequests(procurementService.getRequests());
  };

  const handleAddItem = () => {
    setNewRequest(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', quantity: 1, estimatedCost: 0, justification: '' }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setNewRequest(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setNewRequest(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = newRequest.items.reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
    
    procurementService.saveRequest({
      id: `PR-${Date.now()}`,
      requesterName: newRequest.requesterName,
      department: newRequest.department,
      requestDate: new Date().toISOString(),
      status: 'Submitted',
      totalEstimatedCost: totalCost,
      items: newRequest.items
    });

    loadRequests();
    setIsCreateModalOpen(false);
    setNewRequest({ requesterName: '', department: '', items: [{ itemName: '', quantity: 1, estimatedCost: 0, justification: '' }] });
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

  const handleGeneratePO = (pr: PurchaseRequest, supplier: string) => {
    procurementService.generatePOFromPR(pr, supplier);
    loadRequests();
    setIsPOModalOpen({ isOpen: false });
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
              <React.Fragment key={req.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors cursor-pointer" onClick={() => setExpandedPR(expandedPR === req.id ? null : req.id)}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {expandedPR === req.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{req.id}</div>
                        <div className="text-xs text-gray-500">{req.requesterName} • {req.department}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(req.requestDate).toLocaleDateString()}</div>
                      </div>
                    </div>
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
                    <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
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
                          onClick={() => setIsPOModalOpen({ isOpen: true, pr: req })}
                          className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 flex items-center gap-1"
                        >
                          <ShoppingCart size={14} /> Create PO
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedPR === req.id && (
                  <tr className="bg-gray-50/50 dark:bg-gray-900/20">
                    <td colSpan={5} className="p-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Item Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {req.items.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1a243a] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-900 dark:text-white">{item.itemName}</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Qty: {item.quantity}</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{item.justification}</p>
                              <div className="text-sm font-bold text-blue-600">Est. Cost: ${item.estimatedCost.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                        {req.approvalDate && (
                          <div className="text-xs text-gray-500 mt-2">
                            Approved on: {new Date(req.approvalDate).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="text-blue-600" /> New Purchase Request
            </h2>
            
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Requester Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                    value={newRequest.requesterName}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, requesterName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Department</label>
                  <select 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                    value={newRequest.department}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">Select Department</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Management">Management</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Requested Items</h3>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {newRequest.items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Item Name</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Quantity</label>
                          <input 
                            required 
                            type="number" 
                            min="1"
                            className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          />
                        </div>
                      </div>
                      {newRequest.items.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Est. Unit Cost ($)</label>
                        <input 
                          required 
                          type="number" 
                          className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm"
                          value={item.estimatedCost}
                          onChange={(e) => handleItemChange(index, 'estimatedCost', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Justification</label>
                        <input 
                          required 
                          type="text" 
                          className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm"
                          value={item.justification}
                          onChange={(e) => handleItemChange(index, 'justification', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  Total Estimated: ${newRequest.items.reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0).toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)} 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate PO Modal */}
      {isPOModalOpen.isOpen && isPOModalOpen.pr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="text-purple-600" /> Create Purchase Order
            </h2>
            <p className="text-sm text-gray-500 mb-6">You are generating a PO for Request <span className="font-bold">{isPOModalOpen.pr.id}</span></p>
            
            <form onSubmit={(e: any) => {
              e.preventDefault();
              handleGeneratePO(isPOModalOpen.pr!, e.target.supplier.value);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Select Supplier</label>
                <select name="supplier" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                  <option value="">Select Supplier</option>
                  <option value="Office Depot">Office Depot</option>
                  <option value="Global Tech Solutions">Global Tech Solutions</option>
                  <option value="Scientific Equip Co.">Scientific Equip Co.</option>
                  <option value="Maintenance Supplies Inc.">Maintenance Supplies Inc.</option>
                </select>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase mb-2">Order Summary</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Items:</span>
                  <span className="font-bold">{isPOModalOpen.pr.items.length}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Total Value:</span>
                  <span className="font-bold">${isPOModalOpen.pr.totalEstimatedCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsPOModalOpen({ isOpen: false })} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow-lg"
                >
                  Confirm & Send PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;

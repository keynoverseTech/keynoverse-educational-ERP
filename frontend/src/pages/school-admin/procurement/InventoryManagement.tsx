import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  Plus, 
  Minus,
  History
} from 'lucide-react';
import { procurementService } from './service';
import type { InventoryItem } from './types';

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustmentModal, setAdjustmentModal] = useState<{ isOpen: boolean, item?: InventoryItem, type: 'In' | 'Out' }>({ isOpen: false, type: 'In' });
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setInventory(procurementService.getInventory());
  };

  const handleAdjustment = () => {
    if (!adjustmentModal.item) return;

    const item = adjustmentModal.item;
    let newQty = item.quantity;

    if (adjustmentModal.type === 'In') {
      newQty += Number(adjustQty);
    } else {
      if (item.quantity < adjustQty) {
        alert('Insufficient stock!');
        return;
      }
      newQty -= Number(adjustQty);
    }

    const updatedItem = { ...item, quantity: newQty, lastUpdated: new Date().toISOString() };
    procurementService.updateInventory(updatedItem);
    
    procurementService.logMovement({
      id: `MV-${Date.now()}`,
      itemId: item.id,
      type: adjustmentModal.type,
      quantity: Number(adjustQty),
      date: new Date().toISOString(),
      reason: adjustReason || 'Manual Adjustment',
      performedBy: 'Admin'
    });

    loadInventory();
    setAdjustmentModal({ isOpen: false, type: 'In' });
    setAdjustQty(1);
    setAdjustReason('');
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="text-purple-600" />
            Inventory Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track stock levels and manage store items.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50">
            <Filter size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Item Details</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Location</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id} • {item.category}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {item.location}
                </td>
                <td className="p-4 text-center font-mono font-bold text-lg">
                  {item.quantity}
                </td>
                <td className="p-4">
                  {item.quantity <= item.reorderLevel ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-700 inline-flex items-center gap-1">
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setAdjustmentModal({ isOpen: true, item, type: 'In' })}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                      title="Receive Stock"
                    >
                      <Plus size={18} />
                    </button>
                    <button 
                      onClick={() => setAdjustmentModal({ isOpen: true, item, type: 'Out' })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                      title="Issue Stock"
                    >
                      <Minus size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg" title="History">
                      <History size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adjustment Modal */}
      {adjustmentModal.isOpen && adjustmentModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              {adjustmentModal.type === 'In' ? <Plus className="text-green-600" /> : <Minus className="text-red-600" />}
              {adjustmentModal.type === 'In' ? 'Receive Stock' : 'Issue Stock'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">Adjusting inventory for <span className="font-bold">{adjustmentModal.item.name}</span></p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Reason / Reference</label>
                <input 
                  type="text" 
                  placeholder={adjustmentModal.type === 'In' ? "e.g. Returned Items" : "e.g. Issued to Science Dept"}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setAdjustmentModal({ isOpen: false, type: 'In' })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdjustment}
                className={`px-6 py-2 text-white rounded-lg font-bold shadow-lg transition-colors ${
                  adjustmentModal.type === 'In' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {adjustmentModal.type === 'In' ? 'Receipt' : 'Issuance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle, 
  Package,
  Eye,
  Printer,
  XCircle,
  FileText
} from 'lucide-react';
import { procurementService } from './service';
import type { PurchaseOrder } from './types';

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(procurementService.getOrders());
  };

  const handleReceiveOrder = (order: PurchaseOrder) => {
    if (!window.confirm('Are you sure you want to mark this order as received? This will update inventory stock levels.')) return;

    // 1. Update Order Status
    const updatedOrder: PurchaseOrder = { ...order, status: 'Received', receivedDate: new Date().toISOString() };
    procurementService.updateOrder(updatedOrder);

    // 2. Update Inventory
    const inventory = procurementService.getInventory();
    order.items.forEach(item => {
      const existingItem = inventory.find(i => i.name === item.itemName);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          lastUpdated: new Date().toISOString()
        };
        procurementService.updateInventory(updatedItem);
      } else {
        procurementService.addInventoryItem({
          id: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: item.itemName,
          category: 'General',
          quantity: item.quantity,
          reorderLevel: 10,
          unitPrice: item.unitPrice,
          location: 'Main Store',
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Log Movement
      procurementService.logMovement({
        id: `MV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        itemId: existingItem ? existingItem.id : 'NEW',
        type: 'In',
        quantity: item.quantity,
        date: new Date().toISOString(),
        reason: `PO #${order.id} Received`,
        performedBy: 'Admin'
      });
    });

    loadOrders();
    if (selectedOrder?.id === order.id) setSelectedOrder(updatedOrder);
    alert(`Order ${order.id} received and inventory updated.`);
  };

  const handleCancelOrder = (order: PurchaseOrder) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    const updatedOrder: PurchaseOrder = { ...order, status: 'Cancelled' };
    procurementService.updateOrder(updatedOrder);
    loadOrders();
    if (selectedOrder?.id === order.id) setSelectedOrder(updatedOrder);
  };

  const filteredOrders = orders.filter(o => 
    filter === 'All' ? true : o.status === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Truck className="text-blue-600" />
            Purchase Orders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track supplier orders and receive shipments.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Sent', 'Received', 'Cancelled'].map((status) => (
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

      {/* Order List */}
      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">PO ID / Supplier</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Items</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white">{order.id}</div>
                  <div className="text-xs text-gray-500">{order.supplierName}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {order.items.length} Items
                  </div>
                  <div className="text-xs text-gray-500 font-mono">${order.totalCost.toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1 ${
                    order.status === 'Received' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'Received' && <CheckCircle size={12} />}
                    {order.status === 'Sent' && <Truck size={12} />}
                    {order.status === 'Cancelled' && <XCircle size={12} />}
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {order.status === 'Sent' && (
                      <button 
                        onClick={() => handleReceiveOrder(order)}
                        className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Package size={14} /> Receive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PO Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-3xl rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <FileText className="text-blue-600" /> PURCHASE ORDER
                </h2>
                <p className="text-gray-500 font-mono mt-1">{selectedOrder.id}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200"
                  title="Print PO"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier</h4>
                <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.supplierName}</p>
                <p className="text-sm text-gray-500">Authorized Vendor</p>
              </div>
              <div className="text-right space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Status: <span className="font-bold">{selectedOrder.status}</span></p>
                {selectedOrder.receivedDate && (
                  <p className="text-sm text-green-600 font-bold">Received: {new Date(selectedOrder.receivedDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden mb-8">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Item Description</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Unit Price</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</td>
                      <td className="p-4 text-sm text-gray-700 dark:text-gray-300 text-center">{item.quantity}</td>
                      <td className="p-4 text-sm text-gray-700 dark:text-gray-300 text-right">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-4 text-sm font-bold text-gray-900 dark:text-white text-right">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <td colSpan={3} className="p-4 text-right font-bold text-gray-500 uppercase text-xs">Total Amount</td>
                    <td className="p-4 text-right text-xl font-black text-blue-600">${selectedOrder.totalCost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400 italic">
                PR Reference: {selectedOrder.prId}
              </div>
              <div className="flex gap-3">
                {selectedOrder.status === 'Sent' && (
                  <>
                    <button 
                      onClick={() => handleCancelOrder(selectedOrder)}
                      className="px-6 py-2 text-red-600 border border-red-100 hover:bg-red-50 rounded-xl font-bold transition-colors"
                    >
                      Cancel Order
                    </button>
                    <button 
                      onClick={() => handleReceiveOrder(selectedOrder)}
                      className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Received
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;

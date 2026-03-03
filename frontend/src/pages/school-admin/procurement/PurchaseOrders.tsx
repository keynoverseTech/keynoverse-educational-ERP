import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle, 
  Package
} from 'lucide-react';
import { procurementService } from './service';
import type { PurchaseOrder } from './types';

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(procurementService.getOrders());
  };

  const handleReceiveOrder = (order: PurchaseOrder) => {
    // 1. Update Order Status
    const updatedOrder = { ...order, status: 'Received', receivedDate: new Date().toISOString() };
    procurementService.updateOrder(updatedOrder as any);

    // 2. Update Inventory
    const inventory = procurementService.getInventory();
    order.items.forEach(item => {
      const existingItem = inventory.find(i => i.name === item.itemName);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.lastUpdated = new Date().toISOString();
        procurementService.updateInventory(existingItem);
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
        id: `MV-${Date.now()}`,
        itemId: existingItem ? existingItem.id : 'NEW',
        type: 'In',
        quantity: item.quantity,
        date: new Date().toISOString(),
        reason: `PO #${order.id} Received`,
        performedBy: 'Admin'
      });
    });

    loadOrders();
    alert(`Order ${order.id} received and inventory updated.`);
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
        <button 
          onClick={() => {
            // Demo: Create a random PO
            procurementService.createOrder({
              id: `PO-${Date.now()}`,
              prId: 'PR-DEMO',
              supplierName: 'Office Depot',
              orderDate: new Date().toISOString(),
              status: 'Sent',
              items: [{ itemName: 'A4 Paper Reams', quantity: 50, unitPrice: 5, total: 250 }],
              totalCost: 250
            });
            loadOrders();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Truck size={18} /> Create PO (Demo)
        </button>
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
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
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
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {order.status === 'Sent' && (
                    <button 
                      onClick={() => handleReceiveOrder(order)}
                      className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Package size={14} /> Receive
                    </button>
                  )}
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
    </div>
  );
};

export default PurchaseOrders;

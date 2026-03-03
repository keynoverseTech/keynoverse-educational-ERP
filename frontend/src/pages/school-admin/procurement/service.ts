import type { PurchaseRequest, PurchaseOrder, InventoryItem, Asset, StockMovement } from './types';

const STORAGE_KEYS = {
  REQUESTS: 'procurement_requests',
  ORDERS: 'procurement_orders',
  INVENTORY: 'procurement_inventory',
  ASSETS: 'procurement_assets',
  STOCK_MOVEMENTS: 'procurement_stock_movements'
};

const get = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const save = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const procurementService = {
  // Requests
  getRequests: () => get<PurchaseRequest>(STORAGE_KEYS.REQUESTS),
  saveRequest: (req: PurchaseRequest) => {
    const requests = get<PurchaseRequest>(STORAGE_KEYS.REQUESTS);
    const existingIndex = requests.findIndex(r => r.id === req.id);
    if (existingIndex >= 0) {
      requests[existingIndex] = req;
    } else {
      requests.push(req);
    }
    save(STORAGE_KEYS.REQUESTS, requests);
  },
  
  // Orders
  getOrders: () => get<PurchaseOrder>(STORAGE_KEYS.ORDERS),
  createOrder: (order: PurchaseOrder) => {
    const orders = get<PurchaseOrder>(STORAGE_KEYS.ORDERS);
    orders.push(order);
    save(STORAGE_KEYS.ORDERS, orders);
  },
  updateOrder: (order: PurchaseOrder) => {
    const orders = get<PurchaseOrder>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      save(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // Inventory
  getInventory: () => get<InventoryItem>(STORAGE_KEYS.INVENTORY),
  addInventoryItem: (item: InventoryItem) => {
    const items = get<InventoryItem>(STORAGE_KEYS.INVENTORY);
    items.push(item);
    save(STORAGE_KEYS.INVENTORY, items);
  },
  updateInventory: (item: InventoryItem) => {
    const items = get<InventoryItem>(STORAGE_KEYS.INVENTORY);
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
      save(STORAGE_KEYS.INVENTORY, items);
    }
  },

  // Assets
  getAssets: () => get<Asset>(STORAGE_KEYS.ASSETS),
  saveAsset: (asset: Asset) => {
    const assets = get<Asset>(STORAGE_KEYS.ASSETS);
    const index = assets.findIndex(a => a.id === asset.id);
    if (index >= 0) {
      assets[index] = asset;
    } else {
      assets.push(asset);
    }
    save(STORAGE_KEYS.ASSETS, assets);
  },

  // Stock Movements
  logMovement: (movement: StockMovement) => {
    const movements = get<StockMovement>(STORAGE_KEYS.STOCK_MOVEMENTS);
    movements.push(movement);
    save(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
  },

  // Seed Data (for demo)
  seedData: () => {
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      const initialInventory: InventoryItem[] = [
        { id: 'INV-001', name: 'A4 Paper Reams', category: 'Stationery', quantity: 150, reorderLevel: 50, unitPrice: 5.00, lastUpdated: new Date().toISOString(), location: 'Store A' },
        { id: 'INV-002', name: 'Whiteboard Markers', category: 'Stationery', quantity: 20, reorderLevel: 30, unitPrice: 2.50, lastUpdated: new Date().toISOString(), location: 'Store A' },
        { id: 'INV-003', name: 'Cleaning Fluid (5L)', category: 'Cleaning', quantity: 5, reorderLevel: 10, unitPrice: 15.00, lastUpdated: new Date().toISOString(), location: 'Store B' },
      ];
      save(STORAGE_KEYS.INVENTORY, initialInventory);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      const initialRequests: PurchaseRequest[] = [
        { 
          id: 'PR-2024-001', requesterName: 'John Smith', department: 'Science Dept', requestDate: '2024-03-01', status: 'Submitted', totalEstimatedCost: 1500,
          items: [{ itemName: 'Microscopes', quantity: 5, estimatedCost: 300, justification: 'Lab Upgrade' }] 
        },
        { 
          id: 'PR-2024-002', requesterName: 'Jane Doe', department: 'Admin', requestDate: '2024-03-05', status: 'Approved', totalEstimatedCost: 200, approvalDate: '2024-03-06',
          items: [{ itemName: 'Printer Toner', quantity: 4, estimatedCost: 50, justification: 'Office Supplies' }] 
        }
      ];
      save(STORAGE_KEYS.REQUESTS, initialRequests);
    }
  }
};

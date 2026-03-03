export type RequestStatus = 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Closed' | 'Rejected';
export type OrderStatus = 'Pending' | 'Sent' | 'Received' | 'Cancelled';
export type AssetStatus = 'Active' | 'Under Repair' | 'Retired' | 'Lost';

export interface PurchaseRequest {
  id: string;
  requesterName: string;
  department: string;
  requestDate: string;
  status: RequestStatus;
  items: Array<{
    itemName: string;
    quantity: number;
    estimatedCost: number;
    justification: string;
  }>;
  totalEstimatedCost: number;
  approvalDate?: string;
  poId?: string; // Linked Purchase Order ID
}

export interface PurchaseOrder {
  id: string;
  prId: string; // Linked Purchase Request ID
  supplierName: string;
  orderDate: string;
  status: OrderStatus;
  items: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalCost: number;
  receivedDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  status: AssetStatus;
  location: string;
  custodian: string; // Person responsible
  purchaseDate: string;
  purchaseCost: number;
  maintenanceLog: Array<{
    date: string;
    description: string;
    cost: number;
    technician: string;
  }>;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'In' | 'Out';
  quantity: number;
  date: string;
  reason: string; // e.g., "Purchase Order #PO-123", "Issued to Dept"
  performedBy: string;
}

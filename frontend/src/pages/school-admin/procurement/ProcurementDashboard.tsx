import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  BarChart2,
  AlertTriangle,
  FileText,
  DollarSign
} from 'lucide-react';
import { procurementService } from './service';
import { Link } from 'react-router-dom';

const ProcurementDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeOrders: 0,
    lowStockCount: 0,
    totalAssetValue: 0
  });

  useEffect(() => {
    // Initialize data if empty
    procurementService.seedData();

    const requests = procurementService.getRequests();
    const orders = procurementService.getOrders();
    const inventory = procurementService.getInventory();
    const assets = procurementService.getAssets();

    setStats({
      pendingRequests: requests.filter(r => r.status === 'Submitted').length,
      activeOrders: orders.filter(o => o.status === 'Sent' || o.status === 'Pending').length,
      lowStockCount: inventory.filter(i => i.quantity <= i.reorderLevel).length,
      totalAssetValue: assets.reduce((acc, curr) => acc + (curr.purchaseCost || 0), 0)
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="text-blue-600" />
            Procurement & Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage purchasing, stock levels, and fixed assets.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={FileText} 
          color="text-orange-600" 
          bg="bg-orange-100 dark:bg-orange-900/20" 
        />
        <StatCard 
          title="Active Orders" 
          value={stats.activeOrders} 
          icon={Truck} 
          color="text-blue-600" 
          bg="bg-blue-100 dark:bg-blue-900/20" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockCount} 
          icon={AlertTriangle} 
          color="text-red-600" 
          bg="bg-red-100 dark:bg-red-900/20" 
        />
        <StatCard 
          title="Asset Value" 
          value={`$${stats.totalAssetValue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-green-600" 
          bg="bg-green-100 dark:bg-green-900/20" 
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/school-admin/procurement/requests" className="group block p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-blue-500/25 transition-all">
          <FileText size={32} className="mb-4 text-blue-100" />
          <h3 className="text-xl font-bold mb-2">Purchase Requests</h3>
          <p className="text-blue-100 text-sm">Review and approve departmental requisitions.</p>
        </Link>
        
        <Link to="/school-admin/procurement/inventory" className="group block p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-purple-500/25 transition-all">
          <Package size={32} className="mb-4 text-purple-100" />
          <h3 className="text-xl font-bold mb-2">Inventory Management</h3>
          <p className="text-purple-100 text-sm">Track stock levels, receive goods, and issue items.</p>
        </Link>

        <Link to="/school-admin/procurement/assets" className="group block p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-lg hover:shadow-emerald-500/25 transition-all">
          <BarChart2 size={32} className="mb-4 text-emerald-100" />
          <h3 className="text-xl font-bold mb-2">Fixed Assets</h3>
          <p className="text-emerald-100 text-sm">Register and monitor school property and equipment.</p>
        </Link>
      </div>
    </div>
  );
};

export default ProcurementDashboard;

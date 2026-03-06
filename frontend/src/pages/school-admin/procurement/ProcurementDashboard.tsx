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

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => {
    let gradient = 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500';
    if (title.includes('Pending')) gradient = 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500';
    else if (title.includes('Active')) gradient = 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500';
    else if (title.includes('Low')) gradient = 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500';
    else if (title.includes('Asset')) gradient = 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500';

    return (
      <div className={`relative overflow-hidden bg-white dark:bg-[#151e32] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:shadow-${color.split('-')[1]}-500/10`}>
        <div className={`absolute inset-x-0 top-0 h-1 ${gradient}`} />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={`p-4 rounded-xl ${bg} ${color}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Procurement & Inventory
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-7 h-7" />
              Procurement Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Manage purchasing, stock levels, and fixed assets across the institution.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Total Asset Value</p>
              <p className="text-2xl font-bold">${stats.totalAssetValue.toLocaleString()}</p>
            </div>
          </div>
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

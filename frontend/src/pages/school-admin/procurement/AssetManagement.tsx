import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Wrench, 
  Trash2,
  MapPin,
  User
} from 'lucide-react';
import { procurementService } from './service';
import type { Asset } from './types';

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [, setIsMaintenanceModalOpen] = useState<{ isOpen: boolean, asset?: Asset }>({ isOpen: false });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    setAssets(procurementService.getAssets());
  };

  const handleStatusChange = (asset: Asset, newStatus: any) => {
    const updatedAsset = { ...asset, status: newStatus };
    procurementService.saveAsset(updatedAsset);
    loadAssets();
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Monitor className="text-emerald-600" />
            Fixed Assets
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Register and track equipment, furniture, and vehicles.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Register Asset
        </button>
      </div>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Asset Details</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Location / Custodian</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Purchase Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white">{asset.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{asset.assetTag}</div>
                  <div className="text-xs text-emerald-600 mt-1 font-bold">{asset.category}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPin size={14} className="text-gray-400" /> {asset.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <User size={14} className="text-gray-400" /> {asset.custodian}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(asset.purchaseDate).toLocaleDateString()}
                  <div className="text-xs text-gray-400 mt-1 font-mono">${asset.purchaseCost.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <select 
                    value={asset.status}
                    onChange={(e) => handleStatusChange(asset, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-none outline-none cursor-pointer ${
                      asset.status === 'Active' ? 'bg-green-100 text-green-700' :
                      asset.status === 'Under Repair' ? 'bg-orange-100 text-orange-700' :
                      asset.status === 'Lost' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Under Repair">Under Repair</option>
                    <option value="Retired">Retired</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setIsMaintenanceModalOpen({ isOpen: true, asset })}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" 
                      title="Log Maintenance"
                    >
                      <Wrench size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="text-emerald-600" /> Register New Asset
            </h2>
            
            <form onSubmit={(e: any) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              procurementService.saveAsset({
                id: `AST-${Date.now()}`,
                assetTag: formData.get('tag') as string,
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                status: 'Active',
                location: formData.get('location') as string,
                custodian: formData.get('custodian') as string,
                purchaseDate: new Date().toISOString(),
                purchaseCost: Number(formData.get('cost')),
                maintenanceLog: []
              });
              loadAssets();
              setIsAddModalOpen(false);
            }} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Asset Tag</label>
                  <input name="tag" required type="text" placeholder="e.g. TAG-001" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Asset Name</label>
                  <input name="name" required type="text" placeholder="e.g. Projector" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                  <select name="category" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Vehicle</option>
                    <option>Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cost ($)</label>
                  <input name="cost" required type="number" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                  <input name="location" required type="text" placeholder="Room 101" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Custodian</label>
                  <input name="custodian" required type="text" placeholder="John Doe" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg">Register Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;

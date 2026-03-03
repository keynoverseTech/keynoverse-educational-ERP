import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Wrench, 
  Trash2,
  MapPin,
  User,
  XCircle,
  Calendar
} from 'lucide-react';
import { procurementService } from './service';
import type { Asset } from './types';

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState<{ isOpen: boolean, asset?: Asset }>({ isOpen: false });

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

  const handleAddMaintenance = (e: any) => {
    e.preventDefault();
    if (!maintenanceModal.asset) return;

    const formData = new FormData(e.target);
    const record = {
      date: new Date().toISOString(),
      description: formData.get('description') as string,
      cost: Number(formData.get('cost')),
      technician: formData.get('technician') as string
    };

    const updatedAsset = {
      ...maintenanceModal.asset,
      maintenanceLog: [...maintenanceModal.asset.maintenanceLog, record]
    };

    procurementService.saveAsset(updatedAsset);
    loadAssets();
    setMaintenanceModal({ isOpen: false });
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      procurementService.deleteAsset(id);
      loadAssets();
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-4 pr-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Register Asset
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Asset Details</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Location / Custodian</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Purchase Info</th>
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
                  <div className="text-[10px] text-emerald-600 mt-1 font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-full inline-block">{asset.category}</div>
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
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> {new Date(asset.purchaseDate).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-400 mt-1 font-mono font-bold text-emerald-600">${asset.purchaseCost.toLocaleString()}</div>
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
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setMaintenanceModal({ isOpen: true, asset })}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" 
                      title="Maintenance Log"
                    >
                      <Wrench size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg" 
                      title="Delete Asset"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No assets matching your search were found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Asset Tag</label>
                  <input name="tag" required type="text" placeholder="e.g. TAG-001" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Asset Name</label>
                  <input name="name" required type="text" placeholder="e.g. Projector" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Category</label>
                  <select name="category" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Vehicle</option>
                    <option>Machinery</option>
                    <option>Building</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Purchase Cost ($)</label>
                  <input name="cost" required type="number" min="0" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Location</label>
                  <input name="location" required type="text" placeholder="Room 101" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Custodian</label>
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

      {/* Maintenance Modal */}
      {maintenanceModal.isOpen && maintenanceModal.asset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151e32] w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Wrench className="text-orange-600" /> Maintenance History & Logs
                </h2>
                <p className="text-sm text-gray-500">Asset: <span className="font-bold text-gray-700 dark:text-gray-300">{maintenanceModal.asset.name} ({maintenanceModal.asset.assetTag})</span></p>
              </div>
              <button onClick={() => setMaintenanceModal({ isOpen: false })} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Log Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Add New Record</h3>
                <form onSubmit={handleAddMaintenance} className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Description</label>
                    <textarea name="description" required rows={2} className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm" placeholder="e.g. Lens cleaning and bulb replacement" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Cost ($)</label>
                      <input name="cost" required type="number" className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Technician</label>
                      <input name="technician" required type="text" className="w-full p-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-sm" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 shadow-md">Add Record</button>
                </form>
              </div>

              {/* Log List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Recent Logs</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {maintenanceModal.asset.maintenanceLog.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">No maintenance records found.</div>
                  ) : (
                    [...maintenanceModal.asset.maintenanceLog].reverse().map((log, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-[#1a243a] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
                          <span className="text-xs font-bold text-emerald-600">${log.cost}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{log.description}</p>
                        <div className="text-[10px] text-gray-500">Tech: {log.technician}</div>
                      </div>
                    ))
                  )}
                </div>
                {maintenanceModal.asset.maintenanceLog.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                    <span className="text-gray-500 uppercase font-bold tracking-tighter">Total Maintenance Cost:</span>
                    <span className="font-black text-orange-600 text-sm">${maintenanceModal.asset.maintenanceLog.reduce((sum, l) => sum + l.cost, 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setMaintenanceModal({ isOpen: false })} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;

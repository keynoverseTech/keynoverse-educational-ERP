import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Save, Shield, CheckCircle, 
  Lock, LayoutGrid, FileText, CreditCard, Users, Plus, X,
  Book, Home, Briefcase
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHR, type PermissionModule } from '../../../state/hrAccessControl';

const PermissionsManagement: React.FC = () => {
  const { roles, permissions, rolePermissions, setRolePermissions, setPermissions } = useHR();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({ key: '', description: '', module: 'Student' as PermissionModule });

  useEffect(() => {
    const nextRoleId = (location.state as { roleId?: string } | null | undefined)?.roleId ?? roles[0]?.id ?? null;
    if (!nextRoleId) return;
    queueMicrotask(() => setSelectedRoleId(nextRoleId));
  }, [location.state, roles]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleCreatePermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPermission.key.trim()) return;

    const id = `perm_${newPermission.key.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setPermissions(prev => [...prev, { 
      id, 
      key: newPermission.key.toLowerCase().replace(/\s+/g, '_'),
      description: newPermission.description,
      module: newPermission.module 
    }]);
    
    setNewPermission({ key: '', description: '', module: 'Student' });
    setIsModalOpen(false);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRoleId) return;
    
    setRolePermissions(prev => {
      const existing = prev.find(
        rp => rp.roleId === selectedRoleId && rp.permissionId === permissionId
      );
      
      if (!existing) {
        return [...prev, { roleId: selectedRoleId, permissionId, allowed: true }];
      }
      
      return prev.map(rp =>
        rp.roleId === selectedRoleId && rp.permissionId === permissionId
          ? { ...rp, allowed: !rp.allowed }
          : rp
      );
    });
  };

  const handleToggleGroup = (module: PermissionModule, select: boolean) => {
    if (!selectedRoleId) return;
    
    const modulePerms = permissions.filter(p => p.module === module);
    
    setRolePermissions(prev => {
      // Actually, easier approach: map over prev
      const updatedPrev = prev.map(rp => {
        if (rp.roleId === selectedRoleId && modulePerms.some(p => p.id === rp.permissionId)) {
          return { ...rp, allowed: select };
        }
        return rp;
      });
      
      // Add missing ones
      modulePerms.forEach(p => {
        const existing = prev.find(rp => rp.roleId === selectedRoleId && rp.permissionId === p.id);
        if (!existing) {
          updatedPrev.push({ roleId: selectedRoleId, permissionId: p.id, allowed: select });
        }
      });
      
      return updatedPrev;
    });
  };

  const getPermissionStatus = (permissionId: string) => {
    if (!selectedRoleId) return false;
    const rp = rolePermissions.find(
      x => x.roleId === selectedRoleId && x.permissionId === permissionId
    );
    return rp ? rp.allowed : false;
  };

  const getSelectedCount = () => {
    if (!selectedRoleId) return 0;
    return rolePermissions.filter(rp => rp.roleId === selectedRoleId && rp.allowed).length;
  };

  const filteredPermissions = permissions.filter(p => 
    p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modules = Array.from(new Set(filteredPermissions.map(p => p.module))).sort();

  if (!selectedRole) {
    return <div className="p-6">Loading role...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {selectedRole.name} Permissions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Fine-tune exactly what users with this role can see and do.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter capabilities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-sm">
            <Save size={16} />
            Save Changes
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Create Permission
          </button>
        </div>
      </div>

      {/* Create Permission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white">Create New Permission</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePermission} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission Key</label>
                <input
                  type="text"
                  value={newPermission.key}
                  onChange={e => setNewPermission({ ...newPermission, key: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. view_reports"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module</label>
                <select
                  value={newPermission.module}
                  onChange={e => setNewPermission({ ...newPermission, module: e.target.value as PermissionModule })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Exams">Exams</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Library">Library</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newPermission.description}
                  onChange={e => setNewPermission({ ...newPermission, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Describe what this permission allows..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Sidebar Context */}
        <div className="space-y-6 sticky top-6">
          {/* Security Note */}
          <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Security Note</h3>
            </div>
            <p className="text-blue-100 text-xs leading-relaxed">
              Permissions defined here grant systemic authority. Ensure you only enable capabilities necessary for the role's business function. Changes apply immediately to all users with this role.
            </p>
          </div>

          {/* Selection Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Selection Summary</h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Selected Capabilities</span>
              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-bold">
                {getSelectedCount()}
              </span>
            </div>
            
            <p className="text-xs text-gray-400 italic">
              Use the "Deselect Group" button on the right to quickly select or deselect all items in a category.
            </p>
          </div>
        </div>

        {/* Main Content - Permission Groups */}
        <div className="lg:col-span-2 space-y-6">
          {modules.map(module => {
            const modulePerms = filteredPermissions.filter(p => p.module === module);
            const allSelected = modulePerms.every(p => getPermissionStatus(p.id));
            
            // Map module to icon
            const getIcon = () => {
              switch(module) {
                case 'Finance': return <CreditCard size={18} />;
                case 'Student': return <Users size={18} />;
                case 'Exams': return <FileText size={18} />;
                case 'HR': return <Briefcase size={18} />;
                case 'Library': return <Book size={18} />;
                case 'Hostel': return <Home size={18} />;
                default: return <LayoutGrid size={18} />;
              }
            };

            return (
              <div key={module} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 dark:bg-gray-900/50 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                      {getIcon()}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{module} Management</h3>
                  </div>
                  <button 
                    onClick={() => handleToggleGroup(module, !allSelected)}
                    className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {allSelected ? 'Deselect Group' : 'Select Group'}
                  </button>
                </div>
                
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulePerms.map(perm => {
                    const isAllowed = getPermissionStatus(perm.id);
                    return (
                      <div 
                        key={perm.id}
                        onClick={() => handleTogglePermission(perm.id)}
                        className={`
                          relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                          ${isAllowed 
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' 
                            : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700'}
                        `}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold text-sm ${isAllowed ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                            {perm.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <div className={`
                            w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                            ${isAllowed 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'bg-white border-gray-300 text-transparent group-hover:border-blue-400'}
                          `}>
                            <CheckCircle size={12} fill="currentColor" className={isAllowed ? 'opacity-100' : 'opacity-0'} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {perm.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-wide">
                          <Lock size={10} />
                          <span>CAPABILITY UID: {perm.id.split('_')[1] || perm.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;

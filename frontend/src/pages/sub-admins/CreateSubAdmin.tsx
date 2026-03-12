import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import superAdminService, { type PrivilegeMenuItem, type PrivilegePermissionItem } from '../../services/superAdminApi';

const CreateSubAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'Sub-Admin'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [privilegeName, setPrivilegeName] = useState('Sub-Admin');
  const [privilegeCode, setPrivilegeCode] = useState('SUB');
  const [manualIdsMode, setManualIdsMode] = useState(false);
  const [manualMenuIds, setManualMenuIds] = useState('');
  const [manualPermissionIds, setManualPermissionIds] = useState('');

  const [menus, setMenus] = useState<PrivilegeMenuItem[]>([]);
  const [permissions, setPermissions] = useState<PrivilegePermissionItem[]>([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set());
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const codeFrom = (value: string) => {
      const clean = value.replace(/[^a-z0-9]/gi, '').toUpperCase();
      if (!clean) return 'SUB';
      return clean.length >= 3 ? clean.slice(0, 3) : clean.padEnd(3, 'X');
    };
    setPrivilegeName(formData.roleName || 'Sub-Admin');
    setPrivilegeCode(codeFrom(formData.roleName || 'Sub-Admin'));
  }, [formData.roleName]);

  useEffect(() => {
    const fetchAccessLists = async () => {
      setLoading(true);
      setError('');
      try {
        const [menusRes, permsRes] = await Promise.all([
          superAdminService.getPrivilegeMenus(),
          superAdminService.getPrivilegePermissions(),
        ]);
        const menusList = Array.isArray(menusRes) ? menusRes : (menusRes as any)?.data || [];
        const permsList = Array.isArray(permsRes) ? permsRes : (permsRes as any)?.data || [];
        setMenus(menusList);
        setPermissions(permsList);
        setManualIdsMode(false);
      } catch (err) {
        console.error('Failed to fetch menus/permissions', err);
        setMenus([]);
        setPermissions([]);
        setManualIdsMode(true);
        setError(
          'Failed to load menus/permissions from backend. If the backend has a route like GET /api/privilege/:id, it may be capturing /menus and /permissions. You can paste menu_ids and permission_ids manually below as a workaround.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccessLists();
  }, []);

  const parseIds = (value: string) =>
    value
      .split(/[\s,]+/g)
      .map((s) => s.trim())
      .filter(Boolean);

  const menuRows = useMemo(() => {
    const rows = menus.map((m: any) => ({
      id: String(m.id),
      label: String(m.name || m.code || 'Menu'),
      code: String(m.code || ''),
    })).filter(r => r.id && r.id !== 'undefined');
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.label.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
      : rows;
    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  }, [menus, searchQuery]);

  const permissionRows = useMemo(() => {
    const rows = permissions.map((p: any) => ({
      id: String(p.id),
      label: String(p.name || p.code || 'Permission'),
      code: String(p.code || ''),
    })).filter(r => r.id && r.id !== 'undefined');
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.label.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
      : rows;
    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  }, [permissions, searchQuery]);

  const toggleMenuSelected = (id: string) => {
    setSelectedMenuIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePermissionSelected = (id: string) => {
    setSelectedPermissionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const extractCreatedUserId = (response: any): string | null => {
    const candidates = [
      response?.id,
      response?.user?.id,
      response?.data?.id,
      response?.data?.user?.id,
      response?.result?.id,
    ];
    const id = candidates.find((v) => typeof v === 'string' && v.length > 0);
    return id || null;
  };

  const extractCreatedPrivilegeId = (response: any): string | null => {
    const candidates = [
      response?.id,
      response?.privilege?.id,
      response?.data?.id,
      response?.data?.privilege?.id,
      response?.result?.id,
    ];
    const id = candidates.find((v) => typeof v === 'string' && v.length > 0);
    return id || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await superAdminService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'sub_admin',
        role_name: formData.roleName,
      });

      const createdUserId = extractCreatedUserId(created);
      if (!createdUserId) {
        throw new Error('User created but no user id returned by API');
      }

      const menu_ids = manualIdsMode ? parseIds(manualMenuIds) : Array.from(selectedMenuIds);
      const permission_ids = manualIdsMode ? parseIds(manualPermissionIds) : Array.from(selectedPermissionIds);

      const createdPrivilege = await superAdminService.createPrivilegeWithAccess({
        name: privilegeName || formData.roleName || 'Sub-Admin',
        code: privilegeCode || 'SUB',
        is_active: true,
        menu_ids,
        permission_ids,
      });

      const createdPrivilegeId = extractCreatedPrivilegeId(createdPrivilege);
      if (!createdPrivilegeId) {
        throw new Error('Privilege created but no privilege id returned by API');
      }

      await superAdminService.assignUserPrivilege({
        privilege_id: createdPrivilegeId,
        user_id: createdUserId,
        is_active: true,
      });

      alert('Sub-Admin created successfully!');
      navigate('/super-admin/sub-admins');
    } catch (err: any) {
      console.error('Failed to create sub-admin', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create sub-admin. Please try again.';
      setError(String(message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Sub-Admin</h1>
          <p className="text-gray-500 dark:text-gray-400">Add a new administrator with specific permissions.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-sm font-medium">
            {error}
          </div>
        )}
        {/* User Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Label (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.roleName}
                onChange={e => setFormData({...formData, roleName: e.target.value})}
                placeholder="e.g. Finance Admin"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Role & Permissions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a privilege (role) with access, then assign it to this user.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menus/permissions..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading menus and permissions...</div>
          ) : manualIdsMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Menu IDs (comma/space separated)</label>
                  <textarea
                    value={manualMenuIds}
                    onChange={(e) => setManualMenuIds(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                    placeholder="301452b3-d037-4d2b-b4fe-9e9a33185d7a, 255049d4-b51e-4488-94ee-e17bf24068b0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Permission IDs (comma/space separated)</label>
                  <textarea
                    value={manualPermissionIds}
                    onChange={(e) => setManualPermissionIds(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                    placeholder="d3e9eb93-7388-4d38-ae57-fa2d61ef5e85 8a8c4044-b547-4c6e-9795-58d25592a70d"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                This uses POST /api/privilege/with-access with menu_ids and permission_ids exactly as provided.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Privilege Name</label>
                  <input
                    value={privilegeName}
                    onChange={(e) => setPrivilegeName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Finance Admin"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Privilege Code</label>
                  <input
                    value={privilegeCode}
                    onChange={(e) => setPrivilegeCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                    placeholder="e.g. FIN"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Menus</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedMenuIds.size} selected</div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {menuRows.map((row) => {
                      const isSelected = selectedMenuIds.has(row.id);
                      return (
                        <div key={row.id} className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{row.label}</div>
                            {row.code && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{row.code}</div>}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleMenuSelected(row.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                            } hover:opacity-90`}
                          >
                            {isSelected ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {isSelected ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      );
                    })}
                    {menuRows.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No menus found.</div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Permissions</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedPermissionIds.size} selected</div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {permissionRows.map((row) => {
                      const isSelected = selectedPermissionIds.has(row.id);
                      return (
                        <div key={row.id} className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{row.label}</div>
                            {row.code && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{row.code}</div>}
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePermissionSelected(row.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                            } hover:opacity-90`}
                          >
                            {isSelected ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {isSelected ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      );
                    })}
                    {permissionRows.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No permissions found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Creating...' : 'Create Sub-Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubAdmin;

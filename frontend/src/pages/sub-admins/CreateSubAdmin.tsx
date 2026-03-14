import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search } from 'lucide-react';
import superAdminService, { type PrivilegeMenuItem, type PrivilegePermissionItem } from '../../services/superAdminApi';

const CreateSubAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: 'Sub-Admin'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [privilegeMode, setPrivilegeMode] = useState<'create' | 'existing'>('create');
  const [existingPrivilegeId, setExistingPrivilegeId] = useState('');
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
          superAdminService.getAdminPrivilegeMenus(),
          superAdminService.getAdminPrivilegePermissions(),
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
          'Failed to load menus/permissions from local admin backend. You can paste menu_ids and permission_ids manually below as a workaround.'
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

  const isDuplicateKeyError = (err: any) => {
    const message = (err?.response?.data?.message || err?.message || '').toString().toLowerCase();
    return message.includes('duplicate key value') || message.includes('unique constraint');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let privilegeIdToAssign = existingPrivilegeId.trim();
      if (privilegeMode === 'create') {
        const menu_ids = manualIdsMode ? parseIds(manualMenuIds) : Array.from(selectedMenuIds);
        const permission_ids = manualIdsMode ? parseIds(manualPermissionIds) : Array.from(selectedPermissionIds);

        try {
          const createdPrivilege = await superAdminService.createAdminPrivilegeWithAccess({
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
          privilegeIdToAssign = createdPrivilegeId;
        } catch (err: any) {
          if (isDuplicateKeyError(err)) {
            setError('Privilege code/name already exists on the backend. Change Privilege Code (and/or Name), or switch to "Use Existing Privilege ID".');
            setSaving(false);
            return;
          }
          throw err;
        }
      } else {
        if (!privilegeIdToAssign) {
          setError('Privilege ID is required when using existing privilege.');
          setSaving(false);
          return;
        }
      }

      try {
        await superAdminService.createAdminUser({
          name: formData.name,
          email: formData.email,
          privilege_id: privilegeIdToAssign,
        });
      } catch (err: any) {
        if (isDuplicateKeyError(err)) {
          setError('This email (or another unique field) already exists in the backend. Use a different email, or ask backend to return a clearer error.');
          setSaving(false);
          return;
        }
        throw err;
      }

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
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setPrivilegeMode('create')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors w-fit ${
                    privilegeMode === 'create'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-[#151e32] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                  }`}
                >
                  Create New Privilege
                </button>
                <button
                  type="button"
                  onClick={() => setPrivilegeMode('existing')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors w-fit ${
                    privilegeMode === 'existing'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-[#151e32] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                  }`}
                >
                  Use Existing Privilege ID
                </button>
              </div>

              {privilegeMode === 'existing' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Privilege ID</label>
                  <input
                    value={existingPrivilegeId}
                    onChange={(e) => setExistingPrivilegeId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                    placeholder="baa07091-a385-4c64-b8d6-0344366e59c6"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    This will skip creating a new privilege and assign the existing privilege_id to the new sub-admin.
                  </div>
                </div>
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
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleMenuSelected(row.id)}
                              className="h-4 w-4"
                            />
                            {isSelected ? 'Enabled' : 'Disabled'}
                          </label>
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
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePermissionSelected(row.id)}
                              className="h-4 w-4"
                            />
                            {isSelected ? 'Enabled' : 'Disabled'}
                          </label>
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

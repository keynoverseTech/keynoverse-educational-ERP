import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import superAdminService, { type UserPrivilegeAssignment } from '../../services/superAdminApi';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const EditSubAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({ name: '', email: '', roleName: 'Sub-Admin' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availablePrivileges, setAvailablePrivileges] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<UserPrivilegeAssignment[]>([]);
  const [togglingPrivilegeId, setTogglingPrivilegeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      if (!isUuid(id)) {
        setAvailablePrivileges([]);
        setAssigned([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const currentUserStr = localStorage.getItem('auth_user');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserId: string | undefined = currentUser?.id;

        const [menusResponse, assignedResponse] = await Promise.all([
          currentUserId ? superAdminService.getMyMenus(currentUserId, true) : Promise.resolve([]),
          superAdminService.getUserPermissions(id, true),
        ]);

        const menus = Array.isArray(menusResponse) ? menusResponse : (menusResponse as any)?.data || [];
        const userPerms = Array.isArray(assignedResponse) ? assignedResponse : (assignedResponse as any)?.data || [];

        setAvailablePrivileges(menus);
        setAssigned(userPerms);
      } catch (err) {
        console.error('Failed to load privileges', err);
        setAvailablePrivileges([]);
        setAssigned([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Sub-Admin updated successfully!');
      navigate('/super-admin/sub-admins');
    }, 300);
  };

  const privilegeRows = useMemo(() => {
    const rows = availablePrivileges.map((p: any) => {
      const privilegeId = p.privilege_id || p.privilegeId || p.id;
      const label =
        p.name ||
        p.label ||
        p.menu_name ||
        p.menuName ||
        p.title ||
        p.key ||
        p.slug ||
        'Privilege';
      const group =
        p.group ||
        p.module ||
        p.category ||
        p.parent_name ||
        p.parentName ||
        p.section ||
        'General';
      return { privilegeId: String(privilegeId), label: String(label), group: String(group), raw: p };
    }).filter(r => r.privilegeId && r.privilegeId !== 'undefined');

    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? rows.filter(r => r.label.toLowerCase().includes(q) || r.group.toLowerCase().includes(q))
      : rows;

    filtered.sort((a, b) => (a.group.localeCompare(b.group) || a.label.localeCompare(b.label)));
    return filtered;
  }, [availablePrivileges, searchQuery]);

  const assignedByPrivilegeId = useMemo(() => {
    const map = new Map<string, UserPrivilegeAssignment>();
    assigned.forEach((a) => {
      const pid = a.privilege_id || a.privilegeId;
      if (pid) map.set(String(pid), a);
    });
    return map;
  }, [assigned]);

  const togglePrivilege = async (privilegeId: string) => {
    if (!id) return;
    const existing = assignedByPrivilegeId.get(privilegeId);
    setTogglingPrivilegeId(privilegeId);
    try {
      const isActive = existing?.is_active ?? existing?.isActive ?? false;
      if (!existing || !isActive) {
        await superAdminService.assignUserPrivilege({ privilege_id: privilegeId, user_id: id, is_active: true });
      } else {
        const assignmentId = existing.id;
        await superAdminService.deactivateUserPrivilege(assignmentId);
      }
      const refreshed = await superAdminService.getUserPermissions(id, true);
      const list = Array.isArray(refreshed) ? refreshed : (refreshed as any)?.data || [];
      setAssigned(list);
    } catch (err) {
      console.error('Failed to toggle privilege', err);
      alert('Failed to update privilege');
    } finally {
      setTogglingPrivilegeId(null);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Sub-Admin</h1>
          <p className="text-gray-500 dark:text-gray-400">Assign or revoke privileges for this sub-admin.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle privileges on/off for this user.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search privileges..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading privileges...</div>
          ) : !id || !isUuid(id) ? (
            <div className="py-10 text-center text-sm text-rose-600 dark:text-rose-400">Invalid user id. Please open this page from the Sub-Admin list.</div>
          ) : privilegeRows.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No privileges found.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              {privilegeRows.map((row) => {
                const existing = assignedByPrivilegeId.get(row.privilegeId);
                const isActive = existing?.is_active ?? existing?.isActive ?? false;
                const isBusy = togglingPrivilegeId === row.privilegeId;
                return (
                  <div key={row.privilegeId} className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{row.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{row.group}</div>
                    </div>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => togglePrivilege(row.privilegeId)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      } ${isBusy ? 'opacity-60 cursor-wait' : 'hover:opacity-90'}`}
                    >
                      {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {isActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubAdmin;

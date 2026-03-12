import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Activity } from 'lucide-react';
import superAdminService, { type UserListItem } from '../../services/superAdminApi';

type SubAdminRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
};

const SubAdminList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subAdmins, setSubAdmins] = useState<SubAdminRow[]>([]);

  const normalizeRole = (role: any) => (role || '').toString().toLowerCase().replace(/ /g, '_');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await superAdminService.getSubAdmins();
        const data: UserListItem[] = Array.isArray(res) ? res : (res as any)?.data || [];

        const rows = data
          .filter((u: any) => normalizeRole(u.role) === 'sub_admin')
          .map((u: any) => {
            const status: SubAdminRow['status'] =
              u.is_active === false || (u.status || '').toString().toLowerCase().includes('inactive')
                ? 'Inactive'
                : 'Active';
            const lastLogin =
              u.last_login ||
              u.lastLogin ||
              u.updated_at ||
              '—';
            return {
              id: String(u.id),
              name: String(u.name || '—'),
              email: String(u.email || '—'),
              role: String(u.role || 'sub_admin'),
              lastLogin: String(lastLogin),
              status,
            };
          })
          .filter(r => r.id);

        setSubAdmins(rows as SubAdminRow[]);
      } catch (err: any) {
        console.error('Failed to load sub-admins', err);
        const status = err?.response?.status;
        if (status === 403) setError('Forbidden: backend must allow super_admin to access GET /api/sub-admins.');
        else if (status === 404) setError('Not found: backend must implement GET /api/sub-admins for listing sub-admin users.');
        else setError('Failed to load sub-admins');
        setSubAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const emptyText = useMemo(() => {
    if (loading) return '';
    if (error) return '';
    return 'No sub-admins found.';
  }, [loading, error]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub-Admin Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage access and permissions for subscriber administrators.</p>
        </div>
        <button
          onClick={() => navigate('/super-admin/sub-admins/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Create Sub-Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">All Sub-Admins</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Last Login</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      Loading sub-admins...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-rose-600 dark:text-rose-400">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && subAdmins.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      {emptyText}
                    </td>
                  </tr>
                )}
                {!loading && !error && subAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{admin.name}</div>
                          <div className="text-xs text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        admin.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/super-admin/sub-admins/edit/${admin.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Activity size={18} className="text-gray-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
            Activity logs will appear here when the backend provides an audit/activity endpoint for sub-admin actions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminList;

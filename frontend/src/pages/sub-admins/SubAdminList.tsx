import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Shield, Activity } from 'lucide-react';

// Mock Data for Sub-Admins
const mockSubAdmins = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'sub_admin', lastLogin: '2024-03-05 10:00 AM', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'sub_admin', lastLogin: '2024-03-04 02:30 PM', status: 'Inactive' },
];

const mockActivityLogs = [
  { id: 1, user: 'John Doe', action: 'Viewed Institute: ABC University', time: '10 mins ago' },
  { id: 2, user: 'Jane Smith', action: 'Generated Finance Report', time: '1 hour ago' },
  { id: 3, user: 'John Doe', action: 'Approved Registration: XYZ College', time: '2 hours ago' },
];

const SubAdminList: React.FC = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState(mockSubAdmins);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Sub-Admin?')) {
      setSubAdmins(subAdmins.filter(admin => admin.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setSubAdmins(subAdmins.map(admin => 
      admin.id === id ? { ...admin, status: admin.status === 'Active' ? 'Inactive' : 'Active' } : admin
    ));
  };

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
                {subAdmins.map((admin) => (
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
                          onClick={() => handleToggleStatus(admin.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            admin.status === 'Active' 
                              ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          title={admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/super-admin/sub-admins/edit/${admin.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {mockActivityLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{log.user}</span>
                  <span className="text-xs text-gray-400">{log.time}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{log.action}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center">
            <button className="text-sm text-blue-600 hover:underline">View Full Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminList;

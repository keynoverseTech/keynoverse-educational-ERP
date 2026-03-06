import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PermissionMatrix from '../../components/PermissionMatrix';
import { defaultPermissions, type PermissionSet } from '../../utils/permissionCheck';

const CreateSubAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'Sub-Admin'
  });
  
  const [permissions, setPermissions] = useState<PermissionSet>(defaultPermissions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating Sub-Admin:', { ...formData, permissions });
    // API call would go here
    alert('Sub-Admin created successfully!');
    navigate('/super-admin/sub-admins');
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

        {/* Permissions */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Permission Matrix</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Select the modules and actions this sub-admin can access.</p>
          <PermissionMatrix permissions={permissions} onChange={setPermissions} />
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Save size={20} />
            Create Sub-Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubAdmin;

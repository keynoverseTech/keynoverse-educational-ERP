import React from 'react';
import type { PermissionSet } from '../utils/permissionCheck';

interface PermissionMatrixProps {
  permissions: PermissionSet;
  onChange: (newPermissions: PermissionSet) => void;
  readOnly?: boolean;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ permissions, onChange, readOnly = false }) => {
  
  const handleToggle = (module: string, action: string) => {
    if (readOnly) return;
    
    const currentModulePerms = permissions[module] || {};
    const newValue = !currentModulePerms[action];
    
    onChange({
      ...permissions,
      [module]: {
        ...currentModulePerms,
        [action]: newValue
      }
    });
  };

  const renderCheckbox = (module: string, action: string, label: string) => {
    const isChecked = permissions[module]?.[action] === true;
    
    return (
      <label className={`flex items-center gap-2 ${readOnly ? 'cursor-default' : 'cursor-pointer'} group`}>
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
          isChecked 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
        }`}>
          {isChecked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input 
          type="checkbox" 
          className="hidden" 
          checked={isChecked} 
          onChange={() => handleToggle(module, action)} 
          disabled={readOnly}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </label>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('overview', 'view', 'View Dashboard')}
        </div>
      </div>

      {/* Registration */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Registration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('registration', 'view', 'View Institutes')}
          {renderCheckbox('registration', 'approve', 'Approve Institute')}
          {renderCheckbox('registration', 'reject', 'Reject Institute')}
          {renderCheckbox('registration', 'manage', 'Manage Institutes')}
        </div>
      </div>

      {/* Institute Management */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Institute Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('institute', 'view', 'View Institute')}
          {renderCheckbox('institute', 'manage', 'Manage Institute')}
          {renderCheckbox('institute', 'suspend', 'Suspend Institute')}
          {renderCheckbox('institute', 'view_credentials', 'View Admin Credentials')}
          {renderCheckbox('institute', 'view_audit', 'View Audit Logs')}
        </div>
      </div>

      {/* Program Governance */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Program Governance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('program', 'view', 'View Programs')}
          {renderCheckbox('program', 'assign', 'Assign Programs')}
          {renderCheckbox('program', 'edit', 'Edit Programs')}
          {renderCheckbox('program', 'limit_students', 'Limit Students')}
        </div>
      </div>

      {/* Finance */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Finance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('finance', 'view', 'View Dashboard')}
          {renderCheckbox('finance', 'revenue', 'View Revenue')}
          {renderCheckbox('finance', 'create_plan', 'Create Subscription Plan')}
          {renderCheckbox('finance', 'edit_plan', 'Edit Subscription Plan')}
          {renderCheckbox('finance', 'delete_plan', 'Delete Subscription Plan')}
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('reports', 'view', 'View Reports')}
          {renderCheckbox('reports', 'generate', 'Generate Reports')}
          {renderCheckbox('reports', 'export', 'Export Reports')}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCheckbox('config', 'modules', 'Manage Global Modules')}
          {renderCheckbox('config', 'maintenance', 'Maintenance Mode')}
          {renderCheckbox('config', 'settings', 'System Settings')}
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;

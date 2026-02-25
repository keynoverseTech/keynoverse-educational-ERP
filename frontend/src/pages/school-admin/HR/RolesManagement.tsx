import React, { useState } from 'react';
import { Users, Edit } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';

const RolesManagement: React.FC = () => {
  const { roles, permissions, rolePermissions, setRolePermissions } = useHR();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    roles.length ? roles[0].id : null
  );

  const handleTogglePermission = (roleId: string, permissionId: string) => {
    setRolePermissions(prev => {
      const existing = prev.find(
        rp => rp.roleId === roleId && rp.permissionId === permissionId
      );
      if (!existing) {
        return [...prev, { roleId, permissionId, allowed: true }];
      }
      return prev.map(rp =>
        rp.roleId === roleId && rp.permissionId === permissionId
          ? { ...rp, allowed: !rp.allowed }
          : rp
      );
    });
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId) || null;

  const modules = Array.from(
    new Set(permissions.map(p => p.module))
  ).sort();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Roles Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Assign permissions to system roles; use overrides for individual staff differences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Roles
          </h2>
          <div className="space-y-2">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border text-sm ${
                  selectedRoleId === role.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{role.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {role.description}
                  </span>
                </div>
                <Edit className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          {selectedRole ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Permissions for {selectedRole.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle allowed actions; individual staff differences are handled via overrides
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {modules.map(module => (
                  <div
                    key={module}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {module} Module
                      </span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions
                        .filter(p => p.module === module)
                        .map(p => {
                          const rp = rolePermissions.find(
                            x =>
                              x.roleId === selectedRole.id &&
                              x.permissionId === p.id
                          );
                          const allowed = rp ? rp.allowed : false;
                          return (
                            <label
                              key={p.id}
                              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                            >
                              <input
                                type="checkbox"
                                checked={allowed}
                                onChange={() =>
                                  handleTogglePermission(selectedRole.id, p.id)
                                }
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                              />
                              <span>
                                <span className="font-medium">{p.key}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                  {p.description}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-sm">
              No role selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesManagement;


import React, { useMemo, useState } from 'react';
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Edit,
  Briefcase
} from 'lucide-react';
import type { Staff, Permission } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

type StaffProfileTab = 'profile' | 'employment' | 'permissions';

interface EffectivePermission {
  permission: Permission;
  inheritedAllowed: boolean;
}

const StaffProfile: React.FC = () => {
  const {
    staff,
    departments,
    designations,
    roles,
    permissions,
    rolePermissions,
    staffOverrides,
    setStaffOverrides,
    hasPermission
  } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(
    staff.length ? staff[0].id : null
  );
  const [activeTab, setActiveTab] = useState<StaffProfileTab>('profile');

  const selectedStaff: Staff | null =
    staff.find(s => s.id === selectedStaffId) || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return;
    }
    const found =
      staff.find(s => {
        const name = `${s.firstName} ${s.lastName}`.toLowerCase();
        return (
          name.includes(term) || s.staffId.toLowerCase().includes(term)
        );
      }) || null;
    if (found) {
      setSelectedStaffId(found.id);
      setActiveTab('profile');
    } else {
      alert('Staff not found');
    }
  };

  const getStatusColor = (status: Staff['status']) => {
    if (status === 'active') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  const handleOverrideChange = (
    staffId: string,
    permissionId: string,
    value: 'inherit' | 'allow' | 'deny'
  ) => {
    setStaffOverrides(prev => {
      const existingIndex = prev.findIndex(
        o => o.staffId === staffId && o.permissionId === permissionId
      );
      if (value === 'inherit') {
        if (existingIndex === -1) {
          return prev;
        }
        return prev.filter(
          o => !(o.staffId === staffId && o.permissionId === permissionId)
        );
      }
      const allowed = value === 'allow';
      if (existingIndex === -1) {
        return [...prev, { staffId, permissionId, allowed }];
      }
      return prev.map(o =>
        o.staffId === staffId && o.permissionId === permissionId
          ? { ...o, allowed }
          : o
      );
    });
  };

  const inheritedPermissions = useMemo(() => {
    if (!selectedStaff) {
      return [] as EffectivePermission[];
    }
    const rolePermIds = rolePermissions
      .filter(rp => rp.roleId === selectedStaff.roleId && rp.allowed)
      .map(rp => rp.permissionId);
    const idSet = new Set(rolePermIds);
    return permissions
      .filter(p => idSet.has(p.id))
      .map(p => ({
        permission: p,
        inheritedAllowed: true
      }));
  }, [selectedStaff, rolePermissions, permissions]);

  const allPermissionsByModule = useMemo(() => {
    if (!selectedStaff) {
      return {} as Record<string, EffectivePermission[]>;
    }
    const byModule: Record<string, EffectivePermission[]> = {};
    permissions.forEach(p => {
      const inherited = rolePermissions.some(
        rp => rp.roleId === selectedStaff.roleId && rp.permissionId === p.id && rp.allowed
      );
      if (!byModule[p.module]) {
        byModule[p.module] = [];
      }
      byModule[p.module].push({
        permission: p,
        inheritedAllowed: inherited
      });
    });
    return byModule;
  }, [permissions, rolePermissions, selectedStaff]);

  const getOverrideValue = (staffId: string, permissionId: string) => {
    const override = staffOverrides.find(
      o => o.staffId === staffId && o.permissionId === permissionId
    );
    if (!override) {
      return 'inherit';
    }
    return override.allowed ? 'allow' : 'deny';
  };

  if (!selectedStaff) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Staff Management
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Find a Staff Member
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Search by name or staff ID to view profile and manage permissions.
          </p>
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto relative"
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter name or ID"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Search Staff
            </button>
          </form>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 mb-4">Quick Access</p>
            <div className="flex flex-wrap justify-center gap-4">
              {staff.slice(0, 6).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStaffId(s.id)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {s.firstName[0]}
                    {s.lastName[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.staffId}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const department = departments.find(
    d => d.id === selectedStaff.departmentId
  );
  const designation = designations.find(
    d => d.id === selectedStaff.designationId
  );
  const role = roles.find(r => r.id === selectedStaff.roleId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedStaffId(null)}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
        >
          &larr; Back to Search
        </button>
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(e as any);
              }
            }}
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {selectedStaff.firstName[0]}
          {selectedStaff.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedStaff.firstName} {selectedStaff.lastName}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(
                selectedStaff.status
              )}`}
            >
              {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Briefcase size={14} /> {designation?.name || 'No designation'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {department?.name || 'No department'}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> {selectedStaff.staffId}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md flex items-center gap-2">
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {(['profile', 'employment', 'permissions'] as const).map(
            tabId => {
              const label =
                tabId === 'profile'
                  ? 'Profile'
                  : tabId === 'employment'
                  ? 'Employment'
                  : 'Permissions';
              const icon =
                tabId === 'profile'
                  ? User
                  : tabId === 'employment'
                  ? Briefcase
                  : Shield;
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tabId
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {React.createElement(icon, { size: 18 })}
                  {label}
                </button>
              );
            }
          )}
        </div>
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.firstName}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Last Name
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.lastName}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {selectedStaff.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {selectedStaff.phone}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Employment Status
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.status === 'active'
                      ? 'Active'
                      : 'Inactive'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Date Employed
                  </label>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedStaff.dateEmployed
                      ? new Date(
                          selectedStaff.dateEmployed
                        ).toLocaleDateString()
                      : 'Not set'}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'employment' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Department
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {department?.name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Designation
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {designation?.name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Role
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-white font-medium">
                      {role?.name || 'Not set'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Inherited Role Permissions
                </h3>
                {inheritedPermissions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This staff member does not inherit any permissions from their role.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {inheritedPermissions.map(({ permission }) => (
                      <div
                        key={permission.id}
                        className="px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm font-semibold text-green-800 dark:text-green-300">
                            {permission.key}
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-400">
                            {permission.description}
                          </div>
                        </div>
                        <CheckCircle
                          size={16}
                          className="text-green-600 dark:text-green-400 mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Personal Permission Overrides
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Adjust permissions for this staff member without changing their role.
                </p>
                <div className="space-y-4">
                  {Object.entries(allPermissionsByModule).map(
                    ([module, perms]) => (
                      <div
                        key={module}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {module} Module
                          </span>
                        </div>
                        <div className="px-4 py-3 space-y-3">
                          {perms.map(({ permission, inheritedAllowed }) => {
                            const overrideValue = getOverrideValue(
                              selectedStaff.id,
                              permission.id
                            ) as 'inherit' | 'allow' | 'deny';
                            const effectiveAllowed = hasPermission(
                              selectedStaff.id,
                              permission.key
                            );
                            return (
                              <div
                                key={permission.id}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                              >
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {permission.key}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {permission.description}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Inherited:{' '}
                                    {inheritedAllowed ? 'Allowed' : 'Denied'} ·
                                    Effective:{' '}
                                    {effectiveAllowed ? 'Allowed' : 'Denied'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <select
                                    className="text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                                    value={overrideValue}
                                    onChange={e =>
                                      handleOverrideChange(
                                        selectedStaff.id,
                                        permission.id,
                                        e.target.value as
                                          | 'inherit'
                                          | 'allow'
                                          | 'deny'
                                      )
                                    }
                                  >
                                    <option value="inherit">
                                      Use role setting
                                    </option>
                                    <option value="allow">
                                      Force allow
                                    </option>
                                    <option value="deny">
                                      Force deny
                                    </option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;

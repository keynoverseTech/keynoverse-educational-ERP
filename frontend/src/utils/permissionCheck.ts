export interface ModulePermissions {
  view?: boolean;
  [action: string]: boolean | undefined;
}

export interface PermissionSet {
  overview?: ModulePermissions;
  registration?: ModulePermissions;
  institute?: ModulePermissions;
  program?: ModulePermissions;
  finance?: ModulePermissions;
  reports?: ModulePermissions;
  config?: ModulePermissions;
  [module: string]: ModulePermissions | undefined;
}

export const SUPER_ADMIN_ROLE = 'super_admin';
export const LEGACY_SUPER_ADMIN_ROLE = 'Administrator';
export const SUB_ADMIN_ROLE = 'sub_admin';

/**
 * Checks if a user has a specific permission.
 * Super Admins always have full access.
 */
export function hasPermission(
  userRole: string | undefined,
  permissions: PermissionSet | undefined,
  module: string,
  action: string
): boolean {
  // Normalize role for comparison (handle 'Super Admin', 'super_admin', 'Administrator', etc.)
  const normalizedRole = userRole?.toLowerCase().replace(/ /g, '_');
  
  // Also check for legacy 'Administrator' directly just in case toLowerCase affected it unexpectedly
  if (normalizedRole === 'super_admin' || normalizedRole === 'administrator' || userRole === SUPER_ADMIN_ROLE || userRole === LEGACY_SUPER_ADMIN_ROLE) {
    return true;
  }
  
  // Also check for 'admin' which might be used in some legacy contexts
  if (normalizedRole === 'admin') {
      return true;
  }
  
  if (!permissions) {
    return false;
  }

  return permissions[module]?.[action] === true;
}

/**
 * Default permissions structure for a new Sub-Admin (all false/empty)
 */
export const defaultPermissions: PermissionSet = {
  overview: { view: true }, // Usually allowed by default, or configurable
  registration: { view: false, approve: false, reject: false, manage: false },
  institute: { view: false, manage: false, suspend: false, view_credentials: false, view_audit: false },
  program: { view: false, assign: false, edit: false, limit_students: false },
  finance: { view: false, revenue: false, create_plan: false, edit_plan: false, delete_plan: false },
  reports: { view: false, generate: false, export: false },
  config: { modules: false, maintenance: false, settings: false }
};

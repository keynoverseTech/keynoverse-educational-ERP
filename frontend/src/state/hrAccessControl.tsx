import React, { createContext, useCallback, useContext, useState } from 'react';

export type DepartmentType = 'Academic' | 'Administrative' | 'Service';

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
}

export interface Designation {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export type PermissionModule = 'Student' | 'Exams' | 'HR' | 'Finance' | 'Library' | 'Hostel';

export interface Permission {
  id: string;
  key: string;
  description: string;
  module: PermissionModule;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  allowed: boolean;
}

export interface StaffPermissionOverride {
  staffId: string;
  permissionId: string;
  allowed: boolean;
}

export type StaffStatus = 'active' | 'inactive';

export interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  designationId: string;
  roleId: string;
  status: StaffStatus;
  dateEmployed: string;
}

interface HRContextValue {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  designations: Designation[];
  setDesignations: React.Dispatch<React.SetStateAction<Designation[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  permissions: Permission[];
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  staffOverrides: StaffPermissionOverride[];
  setStaffOverrides: React.Dispatch<React.SetStateAction<StaffPermissionOverride[]>>;
  hasPermission: (staffId: string, permissionKey: string) => boolean;
}

const HRContext = createContext<HRContextValue | undefined>(undefined);

const initialDepartments: Department[] = [
  { id: 'dept_cs', name: 'Computer Science', type: 'Academic' },
  { id: 'dept_me', name: 'Mechanical Engineering', type: 'Academic' },
  { id: 'dept_registry', name: 'Registry', type: 'Administrative' },
  { id: 'dept_bursary', name: 'Bursary', type: 'Administrative' },
  { id: 'dept_library', name: 'Library Services', type: 'Service' },
];

const initialDesignations: Designation[] = [
  { id: 'des_prof', name: 'Professor' },
  { id: 'des_senior_lecturer', name: 'Senior Lecturer' },
  { id: 'des_lecturer_ii', name: 'Lecturer II' },
  { id: 'des_hod', name: 'Head of Department' },
  { id: 'des_registrar', name: 'Registrar' },
  { id: 'des_bursar', name: 'Bursar' },
  { id: 'des_librarian', name: 'Librarian' },
  { id: 'des_ict_officer', name: 'ICT Officer' },
];

const initialRoles: Role[] = [
  { id: 'role_academic_staff', name: 'Academic Staff', description: 'Teaching and research responsibilities' },
  { id: 'role_department_manager', name: 'Department Manager', description: 'Manages departmental operations' },
  { id: 'role_admissions_officer', name: 'Admissions Officer', description: 'Manages student admissions' },
  { id: 'role_finance_officer', name: 'Finance Officer', description: 'Handles payments and finance operations' },
  { id: 'role_library_officer', name: 'Library Officer', description: 'Manages library services' },
  { id: 'role_hostel_officer', name: 'Hostel Officer', description: 'Manages hostel allocation' },
];

const initialPermissions: Permission[] = [
  { id: 'perm_create_student', key: 'create_student', description: 'Create new student record', module: 'Student' },
  { id: 'perm_edit_student', key: 'edit_student', description: 'Edit existing student record', module: 'Student' },
  { id: 'perm_upload_result', key: 'upload_result', description: 'Upload examination results', module: 'Exams' },
  { id: 'perm_approve_result', key: 'approve_result', description: 'Approve examination results', module: 'Exams' },
  { id: 'perm_collect_payment', key: 'collect_payment', description: 'Collect and confirm payments', module: 'Finance' },
  { id: 'perm_assign_hostel', key: 'assign_hostel', description: 'Assign hostel rooms', module: 'Hostel' },
  { id: 'perm_manage_staff', key: 'manage_staff', description: 'Create and edit staff records', module: 'HR' },
  { id: 'perm_configure_hr', key: 'configure_hr', description: 'Configure HR and role settings', module: 'HR' },
  { id: 'perm_manage_library', key: 'manage_library', description: 'Manage library resources', module: 'Library' },
];

const initialRolePermissions: RolePermission[] = [
  { roleId: 'role_academic_staff', permissionId: 'perm_upload_result', allowed: true },
  { roleId: 'role_academic_staff', permissionId: 'perm_approve_result', allowed: false },
  { roleId: 'role_department_manager', permissionId: 'perm_upload_result', allowed: true },
  { roleId: 'role_department_manager', permissionId: 'perm_approve_result', allowed: true },
  { roleId: 'role_department_manager', permissionId: 'perm_manage_staff', allowed: true },
  { roleId: 'role_admissions_officer', permissionId: 'perm_create_student', allowed: true },
  { roleId: 'role_admissions_officer', permissionId: 'perm_edit_student', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_collect_payment', allowed: true },
  { roleId: 'role_library_officer', permissionId: 'perm_manage_library', allowed: true },
  { roleId: 'role_hostel_officer', permissionId: 'perm_assign_hostel', allowed: true },
  { roleId: 'role_academic_staff', permissionId: 'perm_create_student', allowed: false },
];

const initialStaff: Staff[] = [
  {
    id: 'staff_1',
    staffId: 'STF/2015/001',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@uni.edu',
    phone: '+234 801 234 5678',
    departmentId: 'dept_cs',
    designationId: 'des_senior_lecturer',
    roleId: 'role_academic_staff',
    status: 'active',
    dateEmployed: '2015-01-10',
  },
  {
    id: 'staff_2',
    staffId: 'STF/2010/056',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@uni.edu',
    phone: '+234 809 000 1122',
    departmentId: 'dept_me',
    designationId: 'des_hod',
    roleId: 'role_department_manager',
    status: 'active',
    dateEmployed: '2010-09-01',
  },
  {
    id: 'staff_3',
    staffId: 'STF/2018/112',
    firstName: 'Emily',
    lastName: 'Blunt',
    email: 'emily.b@uni.edu',
    phone: '+234 808 555 6677',
    departmentId: 'dept_cs',
    designationId: 'des_ict_officer',
    roleId: 'role_academic_staff',
    status: 'inactive',
    dateEmployed: '2018-03-20',
  },
];

const initialOverrides: StaffPermissionOverride[] = [
  {
    staffId: 'staff_1',
    permissionId: 'perm_approve_result',
    allowed: true,
  },
  {
    staffId: 'staff_2',
    permissionId: 'perm_collect_payment',
    allowed: false,
  },
];

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [designations, setDesignations] = useState<Designation[]>(initialDesignations);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(initialRolePermissions);
  const [staffOverrides, setStaffOverrides] = useState<StaffPermissionOverride[]>(initialOverrides);

  const hasPermission = useCallback(
    (staffId: string, permissionKey: string) => {
      const staffMember = staff.find(s => s.id === staffId);
      if (!staffMember) {
        return false;
      }

      const permission = permissions.find(p => p.key === permissionKey);
      if (!permission) {
        return false;
      }

      const override = staffOverrides.find(
        o => o.staffId === staffId && o.permissionId === permission.id
      );
      if (override) {
        return override.allowed;
      }

      const rolePermission = rolePermissions.find(
        rp => rp.roleId === staffMember.roleId && rp.permissionId === permission.id
      );
      if (rolePermission) {
        return rolePermission.allowed;
      }

      return false;
    },
    [staff, permissions, rolePermissions, staffOverrides]
  );

  return (
    <HRContext.Provider
      value={{
        staff,
        setStaff,
        departments,
        setDepartments,
        designations,
        setDesignations,
        roles,
        setRoles,
        permissions,
        setPermissions,
        rolePermissions,
        setRolePermissions,
        staffOverrides,
        setStaffOverrides,
        hasPermission,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within HRProvider');
  }
  return context;
};


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

export type Gender = 'Male' | 'Female' | 'Other';

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
  // Personal details
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
  ninNumber?: string;
  profilePicture?: string;
  // Employment
  qualifications?: string;
  // Bank details
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankName?: string;
  bankAddress?: string;
  // ERP login
  loginEmail?: string;
  loginPassword?: string;
}

export interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  carryForward: boolean;
  requiresAttachment: boolean;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  staffId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string;
  status: LeaveStatus;
  comment?: string;
  createdAt: string;
}

export interface StaffSchedule {
  staffId: string;
  day: string;
  startTime: string;
  endTime: string;
}

export type SalaryAdjustmentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SalaryAdjustmentRequest {
  id: string;
  staffId: string;
  currentSalary: number;
  requestedSalary: number;
  reason: string;
  status: SalaryAdjustmentStatus;
  requestDate: string;
  approvalDate?: string;
  comments?: string;
}

export type SalaryAdvanceStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SalaryAdvanceRequest {
  id: string;
  staffId: string;
  amount: number;
  reason: string;
  repaymentMonths: number;
  status: SalaryAdvanceStatus;
  requestDate: string;
  approvalDate?: string;
  comments?: string;
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
  leaveTypes: LeaveType[];
  setLeaveTypes: React.Dispatch<React.SetStateAction<LeaveType[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  schedules: StaffSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<StaffSchedule[]>>;
  salaryAdjustments: SalaryAdjustmentRequest[];
  setSalaryAdjustments: React.Dispatch<React.SetStateAction<SalaryAdjustmentRequest[]>>;
  salaryAdvances: SalaryAdvanceRequest[];
  setSalaryAdvances: React.Dispatch<React.SetStateAction<SalaryAdvanceRequest[]>>;
  hasPermission: (staffId: string, permissionKey: string) => boolean;
}

const HRContext = createContext<HRContextValue | undefined>(undefined);

const initialLeaveTypes: LeaveType[] = [
  { id: 'leave_annual', name: 'Annual Leave', maxDays: 21, carryForward: true, requiresAttachment: false },
  { id: 'leave_sick', name: 'Sick Leave', maxDays: 10, carryForward: false, requiresAttachment: true },
  { id: 'leave_casual', name: 'Casual Leave', maxDays: 5, carryForward: false, requiresAttachment: false },
  { id: 'leave_study', name: 'Study Leave', maxDays: 30, carryForward: false, requiresAttachment: true },
];

const initialLeaveRequests: LeaveRequest[] = [];

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
  // New Roles
  { id: 'role_lecturer', name: 'Lecturer', description: 'Delivers lectures and grades students' },
  { id: 'role_assistant_lecturer', name: 'Assistant Lecturer', description: 'Assists in lectures and grading' },
  { id: 'role_exams_officer', name: 'Exams Officer', description: 'Manages examination processes and results' },
  { id: 'role_bursary_accountant', name: 'Bursary/Accountant', description: 'Manages financial records and transactions' },
  { id: 'role_librarian', name: 'Librarian', description: 'Manages library resources and access' },
  { id: 'role_ict_officer', name: 'ICT Officer', description: 'Manages IT infrastructure and support' },
  { id: 'role_health_officer', name: 'Health Officer', description: 'Manages student health services' },
  { id: 'role_student_affairs_officer', name: 'Student Affairs Officer', description: 'Oversees student welfare and activities' },
  { id: 'role_hostel_manager', name: 'Hostel Manager', description: 'Manages hostel facilities and allocation' },
  { id: 'role_transport_officer', name: 'Transport Officer', description: 'Manages transportation logistics' },
  { id: 'role_security_officer', name: 'Security Officer', description: 'Ensures campus security and safety' },
  { id: 'role_maintenance_officer', name: 'Maintenance Officer', description: 'Oversees facility maintenance' },
  { id: 'role_admin_officer', name: 'Admin Officer', description: 'General administrative duties' },
  { id: 'role_quality_assurance_officer', name: 'Quality Assurance Officer', description: 'Ensures academic and operational quality' },
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
  { id: 'perm_approve_leave', key: 'approve_leave', description: 'Approve or reject leave requests', module: 'HR' },

  // Exams Workflow Permissions
  { id: 'perm_submit_result', key: 'submit_result', description: 'Submit results for departmental review', module: 'Exams' },
  { id: 'perm_review_result_department', key: 'review_result_department', description: 'Review and approve results at department level', module: 'Exams' },
  { id: 'perm_approve_result_faculty', key: 'approve_result_faculty', description: 'Approve results at faculty level', module: 'Exams' },
  { id: 'perm_approve_result_senate', key: 'approve_result_senate', description: 'Final senate approval for results', module: 'Exams' },
  { id: 'perm_publish_result', key: 'publish_result', description: 'Publish results to students', module: 'Exams' },
  { id: 'perm_reopen_result', key: 'reopen_result', description: 'Reopen processed results for correction', module: 'Exams' },

  // Student Finance Permissions
  { id: 'perm_create_fee_structure', key: 'create_fee_structure', description: 'Create new fee structures', module: 'Finance' },
  { id: 'perm_edit_fee_structure', key: 'edit_fee_structure', description: 'Edit existing fee structures', module: 'Finance' },
  { id: 'perm_delete_fee_structure', key: 'delete_fee_structure', description: 'Delete fee structures', module: 'Finance' },
  { id: 'perm_generate_invoice', key: 'generate_invoice', description: 'Generate student invoices', module: 'Finance' },
  { id: 'perm_view_invoice', key: 'view_invoice', description: 'View student invoices', module: 'Finance' },
  { id: 'perm_record_payment', key: 'record_payment', description: 'Record manual payments', module: 'Finance' },
  { id: 'perm_reverse_transaction', key: 'reverse_transaction', description: 'Reverse posted transactions', module: 'Finance' },
  { id: 'perm_generate_receipt', key: 'generate_receipt', description: 'Generate payment receipts', module: 'Finance' },
  { id: 'perm_view_financial_report', key: 'view_financial_report', description: 'View financial reports and dashboards', module: 'Finance' },

  // Payroll Permissions
  { id: 'perm_create_salary_structure', key: 'create_salary_structure', description: 'Create salary structures', module: 'Finance' },
  { id: 'perm_assign_salary_structure', key: 'assign_salary_structure', description: 'Assign salary structures to staff', module: 'Finance' },
  { id: 'perm_generate_payroll', key: 'generate_payroll', description: 'Generate payroll runs', module: 'Finance' },
  { id: 'perm_approve_payroll', key: 'approve_payroll', description: 'Approve payroll runs', module: 'Finance' },
  { id: 'perm_view_payslip', key: 'view_payslip', description: 'View staff payslips', module: 'Finance' },
  { id: 'perm_reverse_payroll', key: 'reverse_payroll', description: 'Reverse payroll runs', module: 'Finance' },
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
  { roleId: 'role_academic_staff', permissionId: 'perm_submit_result', allowed: true },
  { roleId: 'role_department_manager', permissionId: 'perm_review_result_department', allowed: true },
  { roleId: 'role_department_manager', permissionId: 'perm_submit_result', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_create_fee_structure', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_edit_fee_structure', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_delete_fee_structure', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_generate_invoice', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_view_invoice', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_record_payment', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_reverse_transaction', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_generate_receipt', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_view_financial_report', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_create_salary_structure', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_assign_salary_structure', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_generate_payroll', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_approve_payroll', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_view_payslip', allowed: true },
  { roleId: 'role_finance_officer', permissionId: 'perm_reverse_payroll', allowed: true },
  { roleId: 'role_academic_staff', permissionId: 'perm_create_student', allowed: false },
  // Permissions for new roles
  { roleId: 'role_lecturer', permissionId: 'perm_upload_result', allowed: true },
  { roleId: 'role_lecturer', permissionId: 'perm_submit_result', allowed: true },
  { roleId: 'role_assistant_lecturer', permissionId: 'perm_upload_result', allowed: true },
  { roleId: 'role_exams_officer', permissionId: 'perm_upload_result', allowed: true },
  { roleId: 'role_exams_officer', permissionId: 'perm_approve_result', allowed: true },
  { roleId: 'role_exams_officer', permissionId: 'perm_publish_result', allowed: true },
  { roleId: 'role_bursary_accountant', permissionId: 'perm_collect_payment', allowed: true },
  { roleId: 'role_bursary_accountant', permissionId: 'perm_generate_invoice', allowed: true },
  { roleId: 'role_librarian', permissionId: 'perm_manage_library', allowed: true },
  { roleId: 'role_ict_officer', permissionId: 'perm_configure_hr', allowed: true },
  { roleId: 'role_hostel_manager', permissionId: 'perm_assign_hostel', allowed: true },
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
  {
    id: 'staff_4',
    staffId: 'STF/2019/210',
    firstName: 'Michael',
    lastName: 'Ade',
    email: 'michael.ade@uni.edu',
    phone: '+234 807 321 4455',
    departmentId: 'dept_registry',
    designationId: 'des_registrar',
    roleId: 'role_admin_officer',
    status: 'active',
    dateEmployed: '2019-07-15',
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
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(initialLeaveTypes);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [salaryAdjustments, setSalaryAdjustments] = useState<SalaryAdjustmentRequest[]>([]);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvanceRequest[]>([]);

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
        leaveTypes,
        setLeaveTypes,
        leaveRequests,
        setLeaveRequests,
        schedules,
        setSchedules,
        salaryAdjustments,
        setSalaryAdjustments,
        salaryAdvances,
        setSalaryAdvances,
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


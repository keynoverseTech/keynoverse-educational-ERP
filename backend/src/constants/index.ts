export const API_TITLE = 'ERP API';
export const API_DESCRIPTION = `
    ERP is a modern educational management system
    designed to streamline educational operations. This API handles core operations such as:
  - Managing student records and enrollment
  - Managing staff records and payroll
  - Managing school finances and budgets
  - Managing school events and activities
  - Managing school communication and notifications
  - Managing school administration and management
  - Managing school reporting and analytics
  - Managing school settings and preferences
  - Managing school users and permissions
  - Managing school roles and permissions
  - Managing school roles and permissions`;
export const API_LOG_TITLE = 'erp-api';
export const API_VERSION = '1.0.0';
export const DEFAULT_PORT = 4000;
export const OTP_SUBJECT = 'ERP - OTP Verification';
export const OTP_EMAIL_TEMPLATE = 'email_otp.ejs';

export enum AccountStatus {
  NEW = 'new',
  ACTIVE = 'active',
  LOCKED = 'locked',
}

export enum UserRoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  STUDENT = 'student',
}

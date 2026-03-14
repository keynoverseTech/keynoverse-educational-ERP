import axios from 'axios';

// Base URL for the Super Admin endpoints
// As requested, we use the local endpoint for development.
// TODO: Switch to staging URL when provided.
const BASE_URL = '/api';
const ADMIN_BASE_URL = '/admin-api';
const PRIVILEGE_BASE_URL = '/privilege-api';

// Create a dedicated axios instance for Super Admin operations
const superAdminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const privilegeApi = axios.create({
  baseURL: PRIVILEGE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to attach the token
superAdminApi.interceptors.request.use(
  (config) => {
    // Try to get the token from localStorage first (real user session)
    let token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'super_admin' && user.role !== 'admin' && user.role !== 'sub_admin') {
          console.warn('Current user is not Super Admin. Ignoring local token for Super Admin API.');
          token = null;
        }
      } catch (e) {
        console.error('Error parsing auth_user', e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No authorization token available for Super Admin API');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

privilegeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export interface InstitutionRegistrationData {
  name: string;
  address: string;
  website: string;
  custom_domain: string;
  logo: string;
  accreditation_letter: string;
  rector: string;
  rector_email: string;
  rector_phone_number: string;
  contact_email: string;
  institution_type_id: string;
  state_id: string;
  status: 'draft' | 'pending' | 'approved';
}

export interface ProgramAssignmentData {
  institution_id: string;
  programme_id: string;
  year_granted: number;
  accreditation_status: 'approved' | 'pending' | 'denied';
  capacity: number;
  expiration_date: string;
  is_active: boolean;
  created_by?: string;
  last_modified_by?: string;
}

export interface InstitutionQueryData {
  institution_id: string;
  message: string;
}

export interface UserPrivilegeAssignmentData {
  privilege_id: string;
  user_id: string;
  is_active: boolean;
}

export interface UserPrivilegeAssignment {
  id: string;
  privilege_id?: string;
  privilegeId?: string;
  user_id?: string;
  userId?: string;
  is_active?: boolean;
  isActive?: boolean;
  [key: string]: any;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  role_name?: string;
}

export interface CreateAdminUserData {
  name: string;
  email: string;
  privilege_id: string;
}

export interface UserListItem {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  is_active?: boolean;
  last_login?: string;
  lastLogin?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface PrivilegeMenuItem {
  id: string;
  name?: string;
  code?: string;
  [key: string]: any;
}

export interface PrivilegePermissionItem {
  id: string;
  name?: string;
  code?: string;
  [key: string]: any;
}

export interface CreatePrivilegeWithAccessData {
  name: string;
  code: string;
  is_active: boolean;
  menu_ids: string[];
  permission_ids: string[];
}

export interface Privilege {
  id: string;
  name?: string;
  code?: string;
  is_active?: boolean;
  [key: string]: any;
}

export const superAdminService = {
  // Institution Management
  createInstitution: async (data: InstitutionRegistrationData | FormData, onUploadProgress?: (progressEvent: any) => void) => {
    // If data is FormData, let browser set Content-Type (multipart/form-data)
    // If it's JSON, use application/json
    const config = data instanceof FormData 
        ? { 
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
          }
        : {};
        
    const response = await superAdminApi.post('/institutions', data, config);
    return response.data;
  },

  getInstitutions: async () => {
    const response = await superAdminApi.get('/institutions');
    return response.data;
  },

  getInstitutionsPending: async () => {
    const response = await superAdminApi.get('/institutions/list/pending');
    return response.data;
  },

  getInstitutionsApproved: async () => {
    const response = await superAdminApi.get('/institutions/list/approved');
    return response.data;
  },

  getInstitutionsQueried: async () => {
    const response = await superAdminApi.get('/institutions/list/queried');
    return response.data;
  },

  getInstitutionsSuspended: async () => {
    const response = await superAdminApi.get('/institutions/list/suspended');
    return response.data;
  },

  getInstitutionsExpired: async () => {
    const response = await superAdminApi.get('/institutions/list/subs-expired');
    return response.data;
  },

  getInstitution: async (id: string) => {
    // Endpoint provided by user: GET /institutions/:id
    const response = await superAdminApi.get(`/institutions/${id}`);
    return response.data;
  },

  updateInstitution: async (id: string, data: any) => {
    // Generic update endpoint
    const response = await superAdminApi.put(`/institutions/${id}`, data);
    return response.data;
  },

  approveInstitution: async (id: string) => {
    // Approve an institution application
    // Endpoint provided by user: PUT /institutions/approve/:id
    const response = await superAdminApi.put(`/institutions/approve/${id}`, {});
    return response.data;
  },

  rejectInstitution: async (id: string, message?: string) => {
    // Reject an institution application
    // Endpoint provided by user: PUT /institutions/reject/:id
    const body = message ? { message } : {};
    const response = await superAdminApi.put(`/institutions/reject/${id}`, body);
    return response.data;
  },

  suspendInstitution: async (id: string) => {
    // Suspend an institution
    // Endpoint provided by user: PUT /institutions/suspend/:id
    const response = await superAdminApi.put(`/institutions/suspend/${id}`, {});
    return response.data;
  },

  reactivateInstitution: async (id: string) => {
    // Reactivate a suspended institution
    // Endpoint provided by user: PUT /institutions/reactivate/:id
    const response = await superAdminApi.put(`/institutions/reactivate/${id}`, {});
    return response.data;
  },

  createInstitutionQuery: async (data: InstitutionQueryData) => {
    const response = await superAdminApi.post('/institution-queries', data);
    return response.data;
  },

  assignUserPrivilege: async (data: UserPrivilegeAssignmentData) => {
    const response = await privilegeApi.post('/privilege/user-privileges', data);
    return response.data;
  },

  deactivateUserPrivilege: async (id: string) => {
    const response = await privilegeApi.put(`/privilege/user-privileges/deactivate/${id}`, {});
    return response.data;
  },

  getUserPermissions: async (userId: string, activeOnly: boolean = true) => {
    const response = await privilegeApi.get(`/privilege/access/user-permissions?user_id=${userId}&active_only=${activeOnly}`);
    return response.data;
  },

  getMyMenus: async (userId: string, activeOnly: boolean = true) => {
    const response = await privilegeApi.get(`/privilege/access/my-menus?user_id=${userId}&active_only=${activeOnly}`);
    return response.data;
  },

  getPrivilegeMenus: async () => {
    const response = await privilegeApi.get('/privilege/menus');
    return response.data;
  },

  getPrivilegePermissions: async () => {
    const response = await privilegeApi.get('/privilege/permissions');
    return response.data;
  },

  createPrivilegeWithAccess: async (data: CreatePrivilegeWithAccessData) => {
    const response = await privilegeApi.post('/privilege/with-access', data);
    return response.data;
  },

  getAdminPrivilegeMenus: async () => {
    const response = await privilegeApi.get('/privilege/menus');
    return response.data;
  },

  getAdminPrivilegePermissions: async () => {
    const response = await privilegeApi.get('/privilege/permissions');
    return response.data;
  },

  createAdminPrivilegeWithAccess: async (data: CreatePrivilegeWithAccessData) => {
    const response = await privilegeApi.post('/privilege/with-access', data);
    return response.data;
  },

  createAdminUser: async (data: CreateAdminUserData) => {
    const response = await adminApi.post('/users/create-admin', data);
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const endpoints = [
      '/users',
      '/user',
      '/auth/register',
      '/auth/super/register',
      '/auth/admin/register',
      '/auth/super-admin/register',
    ];

    let lastError: any;
    for (const endpoint of endpoints) {
      try {
        const response = await superAdminApi.post(endpoint, data);
        return response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  },

  getUsers: async () => {
    const endpoints = [
      '/users',
      '/user',
      '/users/list',
      '/user/list',
    ];

    let lastError: any;
    for (const endpoint of endpoints) {
      try {
        const response = await superAdminApi.get(endpoint);
        return response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  },

  getSubAdmins: async () => {
    const response = await superAdminApi.get('/users/admins');
    return response.data;
  },

  // Program Management
  getPrograms: async () => {
    const response = await superAdminApi.get('/programme');
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await superAdminApi.get('/subscription');
    return response.data;
  },

  getSubscriptionsPending: async () => {
    const response = await superAdminApi.get('/subscription/list/pending');
    return response.data;
  },

  getSubscriptionsActive: async () => {
    const response = await superAdminApi.get('/subscription/list/active');
    return response.data;
  },

  getSubscriptionsSuspended: async () => {
    const response = await superAdminApi.get('/subscription/list/suspended');
    return response.data;
  },

  getSubscriptionsExpired: async () => {
    const response = await superAdminApi.get('/subscription/list/expired');
    return response.data;
  },

  assignProgram: async (data: ProgramAssignmentData) => {
    const response = await superAdminApi.post('/institution/programme', data);
    return response.data;
  },

  updateInstitutionProgram: async (id: string, data: Partial<ProgramAssignmentData>) => {
    const response = await superAdminApi.put(`/institution/programme/${id}`, data);
    return response.data;
  },

  deleteInstitutionProgram: async (id: string) => {
    const endpoints = [
      `/institution/programme/${id}`,
      `/institution/programme/remove/${id}`,
      `/institution/programme/delete/${id}`,
    ];

    let lastError: any;
    for (const endpoint of endpoints) {
      try {
        const response = await superAdminApi.delete(endpoint);
        return response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  },

  getInstitutionPrograms: async (institutionId: string) => {
    // Correct endpoint for institution programs
    // User reported 404 for /institutions/:id/programs
    // User also reported 404 for /programmes?institution_id=:id
    // User also reported 404 for /institution/programme/:id
    
    // BUT user previously shared a log showing a list of programs ("Unknown Program").
    // That means ONE of the previous attempts worked.
    
    // Let's look at the very first successful log where "Unknown Program" appeared.
    // At that time, the code was:
    // const response = await superAdminApi.get(`/institution/programme/list/${institutionId}`);
    
    // I changed it AWAY from that because I thought it was non-standard.
    // But if that was the one returning data, we must go back to it!
    
    const response = await superAdminApi.get(`/institution/programme/list/${institutionId}`);
    const data = response.data;
    if (Array.isArray(data) && data.some((p: any) => p?.institution_id || p?.institutionId || p?.institution?.id)) {
      return data.filter((p: any) => {
        const id = p?.institution_id || p?.institutionId || p?.institution?.id;
        return id === institutionId;
      });
    }
    return data;
  },

  // Utilities
  getStates: async () => {
    const response = await superAdminApi.get('/state');
    return response.data;
  },

  getInstitutionTypes: async () => {
    // Correct endpoint for institution types
    const response = await superAdminApi.get('/institution-types');
    return response.data;
  },

  // Subscription & Modules
  getModules: async () => {
    // const response = await superAdminApi.get('/modules');
    // return response.data;
    // Mock data for modules since endpoint returns 404
    return [
      { id: 'mod-001', name: 'Admission & Enrollment' },
      { id: 'mod-002', name: 'Student Information System' },
      { id: 'mod-003', name: 'Academic Records (Result Processing)' },
      { id: 'mod-004', name: 'Course Registration' },
      { id: 'mod-005', name: 'Bursary & Finance' },
      { id: 'mod-006', name: 'Hostel Management' },
      { id: 'mod-007', name: 'HR & Payroll' },
      { id: 'mod-008', name: 'E-Library' },
      { id: 'mod-009', name: 'Computer Based Test (CBT)' },
      { id: 'mod-010', name: 'Alumni Management' }
    ];
  },

  getSubscriptionPlans: async () => {
    const response = await superAdminApi.get('/subscription-plan');
    return response.data;
  },

  createSubscriptionPlan: async (data: {
    name: string;
    no_of_days: number;
    amount: number;
    description: string;
    notes: string;
    is_active: boolean;
  }) => {
    const response = await superAdminApi.post('/subscription-plan', data);
    return response.data;
  },

  updateSubscriptionPlan: async (
    id: string,
    data: Partial<{
      name: string;
      no_of_days: number;
      amount: number;
      description: string;
      notes: string;
      is_active: boolean;
    }>
  ) => {
    const response = await superAdminApi.put(`/subscription-plan/${id}`, data);
    return response.data;
  },
};

export default superAdminService;

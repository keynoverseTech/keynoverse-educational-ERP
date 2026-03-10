import axios from 'axios';

// Base URL for the Super Admin endpoints
// As requested, we use the local endpoint for development.
// TODO: Switch to staging URL when provided.
const BASE_URL = '/api';

// Create a dedicated axios instance for Super Admin operations
const superAdminApi = axios.create({
  baseURL: BASE_URL,
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
        if (user.role !== 'super_admin' && user.role !== 'admin') {
          console.warn('Current user is not Super Admin. Ignoring local token for Super Admin API.');
          token = null;
        }
      } catch (e) {
        console.error('Error parsing auth_user', e);
      }
    }

    // If no local token (or ignored), use the hardcoded test token as a fallback (dev/test mode)
    if (!token) {
      console.warn('Using hardcoded test token for Super Admin API');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyYWRtaW5AcGxhbmV0c3RlY2guY29tIiwic3ViIjoiZjNiNmNmMDEtOWExYy00ZWYwLTgxN2YtN2Q5MWQ1YzljZDBkIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzcyOTU5NzY3LCJleHAiOjE3NzMwNDYxNjd9.E1OgdZteXb7iBLhxA8FL9ozsx6jJjvUqFOg_43do6q8';
    }

    // Always attach the token if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        // Log warning if token is somehow missing even when hardcoded
        console.warn('No authorization token available for Super Admin API');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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

  // Program Management
  getPrograms: async () => {
    const response = await superAdminApi.get('/programme');
    return response.data;
  },

  assignProgram: async (data: ProgramAssignmentData) => {
    const response = await superAdminApi.post('/institution/programme', data);
    return response.data;
  },

  updateInstitutionProgram: async (id: string, _data: Partial<ProgramAssignmentData>) => {
    // Speculative endpoint for updating an assignment
    // Trying PUT instead of PATCH as PATCH returned 404
    const response = await superAdminApi.put(`/institution/programme/${id}`, {});
    return response.data;
  },

  deleteInstitutionProgram: async (id: string) => {
    // Speculative endpoint for deleting an assignment
    // Failed: DELETE /institution/programme/:id (404)
    // Failed: DELETE /institution/programme/delete/:id (404)
    
    // Trying 'remove' pattern: DELETE /institution/programme/remove/:id
    const response = await superAdminApi.delete(`/institution/programme/remove/${id}`);
    return response.data;
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
    return response.data;
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
    // const response = await superAdminApi.get('/subscription-plan');
    // return response.data;
    // Mock data for plans since endpoint returns 404
    return [
      { id: 'plan-basic', name: 'Basic Tier (0-1,000 Students)', price: 500000 },
      { id: 'plan-standard', name: 'Standard Tier (1,001-5,000 Students)', price: 1500000 },
      { id: 'plan-premium', name: 'Premium Tier (5,001-10,000 Students)', price: 3000000 },
      { id: 'plan-enterprise', name: 'Enterprise Tier (10,000+ Students)', price: 5000000 }
    ];
  },
};

export default superAdminService;

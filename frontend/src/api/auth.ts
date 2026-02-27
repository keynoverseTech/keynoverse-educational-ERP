import client from './client';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthApi {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  me: () => Promise<User>;
}

export const authApi: AuthApi = {
  login: async (email, password) => {
    try {
      const response = await client.post<LoginResponse>('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login failed in API:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    // Attempt to call backend logout, but don't block if it fails (e.g., 404)
    try {
      await client.post('/auth/logout');
    } catch (error: any) {
      // 404 (Not Found) or 401 (Unauthorized - already logged out) are acceptable errors
      // that we can ignore when logging out.
      const status = error.response?.status;
      if (status === 404 || status === 401) {
        console.warn(`Logout endpoint returned ${status}, treating as success for local logout.`);
      } else {
        console.error('Logout failed:', error);
      }
    }
  },

  me: async () => {
    const response = await client.get<User>('/users/me');
    return response.data;
  },
};

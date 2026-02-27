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
    const response = await client.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    // Attempt to call backend logout, but don't block if it fails (e.g., 404)
    try {
      await client.post('/auth/logout');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.warn('Logout endpoint not found (404), treating as success for local logout.');
        // 404 means the endpoint doesn't exist, so we can consider it "done" from the client's perspective
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

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AxiosError } from 'axios';
import api from '../services/api';
import superAdminService from '../services/superAdminApi';

import type { PermissionSet } from '../utils/permissionCheck';
import { privilegesToPermissionSet } from '../utils/privilegeToPermissionSet';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  passwordUpdated?: boolean;
  permissions?: PermissionSet;
  level?: string | number;
  cgpa?: number;
  completedCourses?: string[];
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, endpointPath?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (token && savedUser) {
        try {
          const restored = JSON.parse(savedUser) as User;
          if (restored?.role?.toLowerCase().replace(/ /g, '_') === 'sub_admin') {
            try {
              const permsResponse = await superAdminService.getUserPermissions(restored.id, true);
              const permsList = Array.isArray(permsResponse) ? permsResponse : (permsResponse as any)?.data || [];
              const permissions = privilegesToPermissionSet(permsList);
              const updated = { ...restored, permissions };
              localStorage.setItem('auth_user', JSON.stringify(updated));
              setUser(updated);
            } catch (err) {
              console.error('Failed to refresh sub-admin permissions', err);
              setUser(restored);
            }
          } else {
            setUser(restored);
          }
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to restore auth state', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, endpointPath: string = '/auth/login') => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { access_token, user: loggedInUser } } = await api.post<LoginResponse>(endpointPath, { email, password });
      
      localStorage.setItem('auth_token', access_token);
      let userToStore: User = loggedInUser;
      if (loggedInUser?.role?.toLowerCase().replace(/ /g, '_') === 'sub_admin') {
        try {
          const permsResponse = await superAdminService.getUserPermissions(loggedInUser.id, true);
          const permsList = Array.isArray(permsResponse) ? permsResponse : (permsResponse as any)?.data || [];
          userToStore = { ...loggedInUser, permissions: privilegesToPermissionSet(permsList) };
        } catch (err) {
          console.error('Failed to load sub-admin permissions during login', err);
        }
      }
      localStorage.setItem('auth_user', JSON.stringify(userToStore));
      
      setUser(userToStore);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.error('Login failed', err);
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const message = axiosErr.response?.data?.message;
      const errorMessage =
        (Array.isArray(message) ? message[0] : message) || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAuthenticated(false);
    // Optional: Call backend logout endpoint if necessary, but typically JWT logout is client-side
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

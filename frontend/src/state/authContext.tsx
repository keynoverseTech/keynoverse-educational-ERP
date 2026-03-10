import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AxiosError } from 'axios';
import api from '../services/api';

import type { PermissionSet } from '../utils/permissionCheck';

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
          setUser(JSON.parse(savedUser));
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
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      
      setUser(loggedInUser);
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

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Simple ID generator to avoid external dependency
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let user: User;
      let response: LoginResponse;

      if (email === 'superadmin@keynoverse.com' && password === 'password') {
         user = {
           id: generateId(),
           email,
           first_name: 'Super',
           last_name: 'Admin',
           role: 'super-admin'
         };
         response = {
           access_token: 'mock_super_admin_access_token_' + generateId(),
           refresh_token: 'mock_super_admin_refresh_token_' + generateId(),
           token_type: 'bearer',
           expires_in: 3600,
           user
         };
      } else if (email.includes('admin')) {
          user = {
              id: generateId(),
              email,
              first_name: 'School',
              last_name: 'Admin',
              role: 'school-admin'
          };
          response = {
              access_token: 'mock_school_admin_token_' + generateId(),
              refresh_token: 'mock_school_admin_refresh_token_' + generateId(),
              token_type: 'bearer',
              expires_in: 3600,
              user
          };
      } else {
          user = {
              id: generateId(),
              email,
              first_name: 'Demo',
              last_name: 'User',
              role: 'user'
          };
          response = {
              access_token: 'mock_demo_token_' + generateId(),
              refresh_token: 'mock_demo_refresh_token_' + generateId(),
              token_type: 'bearer',
              expires_in: 3600,
              user
          };
      }
      
      const { access_token, refresh_token, user: loggedInUser } = response;
      
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const errorMessage = 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAuthenticated(false);
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

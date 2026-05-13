import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api.config';

interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: {
    id: number;
    name: string;
    slug: 'super_admin' | 'admin' | 'reseller' | 'client';
  };
  profile?: {
    country?: string;
    address?: string;
    image?: string;
  };
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token/get user
      axios.get(`${API_CONFIG.baseUrl}/user`)
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isSuperAdmin = user?.role?.slug === 'super_admin';
  const isAdmin = user?.role?.slug === 'admin' || isSuperAdmin;
  const isReseller = user?.role?.slug === 'reseller';
  const isClient = user?.role?.slug === 'client';

  return (
    <AuthContext.Provider value={{ 
      user, token, login, logout, loading,
      isSuperAdmin, isAdmin, isReseller, isClient 
    }}>
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

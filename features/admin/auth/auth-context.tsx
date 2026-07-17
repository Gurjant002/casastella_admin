'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('admin_token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

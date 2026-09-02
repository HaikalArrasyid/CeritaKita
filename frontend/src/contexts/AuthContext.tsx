'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch, setGlobalToken } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      setGlobalToken(token);
      apiFetch('/auth/me')
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            setGlobalToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setGlobalToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userData: User, rememberMe: boolean = true) => {
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
    setGlobalToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setGlobalToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

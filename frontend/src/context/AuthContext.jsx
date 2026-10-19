import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('novacart_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('novacart_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('novacart_token');
      if (savedToken) {
        try {
          const profile = await api.getMe();
          const userData = profile?.user || (profile && (profile.id || profile.email) ? profile : null);
          if (userData && (userData.id || userData.email || userData.full_name)) {
            setUser(userData);
            try {
              localStorage.setItem('novacart_user', JSON.stringify(userData));
            } catch (e) {}
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          // Only force logout on explicit 401 Unauthorized or 403 Forbidden
          if (err.status === 401 || err.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data && data.token) {
        const userData = data?.user || data;
        localStorage.setItem('novacart_token', data.token);
        try {
          localStorage.setItem('novacart_user', JSON.stringify(userData));
        } catch (e) {}
        setToken(data.token);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data && data.token) {
        const userObj = data?.user || data;
        localStorage.setItem('novacart_token', data.token);
        try {
          localStorage.setItem('novacart_user', JSON.stringify(userObj));
        } catch (e) {}
        setToken(data.token);
        setUser(userObj);
        return { success: true, user: userObj };
      }
      return { success: true, message: data.message };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('novacart_token');
    localStorage.removeItem('novacart_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      register,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

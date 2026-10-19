import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('novacart_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current user on mount
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getMe();
          const userData = profile?.user || profile;
          setUser(userData);
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data && data.token) {
        const userData = data?.user || data;
        localStorage.setItem('novacart_token', data.token);
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

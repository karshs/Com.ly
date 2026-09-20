import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('comly_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('comly_user');
      if (savedUser) {
        try {
          const data = await authApi.refreshToken();
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
          }
        } catch (err) {
          // Token expired or invalid refresh cookie -> clean up
          localStorage.removeItem('comly_user');
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    setUser(data.user);
    localStorage.setItem('comly_user', JSON.stringify(data.user));
    return data;
  };

  const signup = async (username, email, password) => {
    return await authApi.signup({ username, email, password });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('comly_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

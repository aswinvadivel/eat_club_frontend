import React, { createContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { normalizeRole } from '../utils/helpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          role: normalizeRole(parsedUser?.role),
        });
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.signup(credentials);
      const { token, ...userData } = response.data;
      const normalizedUserData = {
        ...userData,
        role: normalizeRole(userData?.role),
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUserData));
      setUser(normalizedUserData);
      
      return normalizedUserData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, ...userData } = response.data;
      const normalizedUserData = {
        ...userData,
        role: normalizeRole(userData?.role),
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUserData));
      setUser(normalizedUserData);
      
      return normalizedUserData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: normalizeRole(user?.role) === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

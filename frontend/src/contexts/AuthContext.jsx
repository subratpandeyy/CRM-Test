import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.email) {
        setUser(userInfo);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      const loginData = { email: email.trim(), password };

      const response = await api.post('/auth/login', loginData);

      const { token, memberId, email: userEmail, name, orgId, orgName, role } = response.data;

      if (!token) return { success: false, error: 'Invalid response from server' };

      localStorage.setItem('token', token);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ memberId, email: userEmail, name, orgId, orgName, role })
      );

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser({ memberId, email: userEmail, name, orgId, orgName, role });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (...args) => {
    try {
      const response = await api.post('/auth/register', {
        orgName: args[0],
        orgEmail: args[1],
        adminName: args[2],
        adminEmail: args[3],
        adminPassword: args[4],
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

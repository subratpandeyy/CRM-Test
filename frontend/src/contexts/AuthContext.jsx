import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRbacForCurrentUser = async () => {
    try {
      const response = await api.get('/rbac/users/me');
      const { roles: r, permissions: p } = response.data || {};
      setRoles(r || []);
      setPermissions(p || []);
    } catch (e) {
      console.error('Failed to load RBAC info for current user', e);
      setRoles([]);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user info from token (you might want to decode JWT or make an API call)
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.email) {
        setUser(userInfo);
        loadRbacForCurrentUser().finally(() => setLoading(false));
        return;
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Validate input
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email and password are required' 
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { 
          success: false, 
          error: 'Please enter a valid email address' 
        };
      }

      // Validate password length
      if (password.length < 6) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        };
      }

      console.log('Attempting login with:', { email: email.trim(), password: '***' });
      
      // Prepare the request payload exactly as expected by Spring Boot
      const loginData = {
        email: email.trim(),
        password: password
      };
      
      console.log('Sending login request to:', api.defaults.baseURL + '/auth/login');
      console.log('Request payload:', { email: loginData.email, password: '***' });
      
      const response = await api.post('/auth/login', loginData);
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
      
      const { token, memberId, email: userEmail, name, orgId, orgName, role } = response.data;
      
      if (!token) {
        return { 
          success: false, 
          error: 'Invalid response from server - no token received' 
        };
      }
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify({
        memberId,
        email: userEmail,
        name,
        orgId,
        orgName,
        role
      }));
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({
        memberId,
        email: userEmail,
        name,
        orgId,
        orgName,
        role
      });

      // Load roles & permissions for this user
      await loadRbacForCurrentUser();
      
      return { success: true };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 400) {
          // Handle validation errors from Spring Boot
          if (data && typeof data === 'string') {
            errorMessage = data;
          } else if (data && data.message) {
            errorMessage = data.message;
          } else if (data && Array.isArray(data)) {
            errorMessage = data.join(', ');
          } else {
            errorMessage = 'Invalid email or password format';
          }
        } else if (status === 401) {
          errorMessage = 'Invalid credentials';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const register = async (orgName, orgEmail, adminName, adminEmail, adminPassword) => {
    try {
      const response = await api.post('/auth/register', {
        orgName,
        orgEmail,
        adminName,
        adminEmail,
        adminPassword
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          errorMessage = data?.message || 'Invalid registration data';
        } else if (status === 409) {
          errorMessage = 'Email or organization already exists';
        } else {
          errorMessage = data?.message || `Registration error (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  const hasRole = (roleName) => {
    if (!roleName) return false;
    return roles.includes(roleName) || user?.role === roleName;
  };

  const hasPermission = (permissionName) => {
    if (!permissionName) return false;
    return permissions.includes(permissionName);
  };

  const value = {
    user,
    roles,
    permissions,
    login,
    register,
    logout,
    loading,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

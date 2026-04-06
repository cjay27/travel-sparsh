import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

// Demo admin credentials — replacing with real API call in production
// const ADMIN_CREDS = { email: 'admin@travelsparsh.com', password: 'Admin@123' };
const STORAGE_KEY = 'ts_admin_session';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setError('');
    setLoading(true);
    
    try {
      // Using real API instead of mock
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      
      // Check if user is actually admin
      if (user.role !== 'admin') {
        setError('Unauthorized: Admin access required.');
        setLoading(false);
        return false;
      }
      
      const session = { ...user, loginAt: new Date().toISOString() };
      setAdmin(session);
      
      // Store standard tokens so that utils/api.js intercepts them properly
      localStorage.setItem('travel_sparsh_token', token);
      localStorage.setItem('travel_sparsh_user', JSON.stringify(user));
      // Also store admin session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (err) {}
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('travel_sparsh_token');
    localStorage.removeItem('travel_sparsh_user');
  }, []);

  return (
    <AdminContext.Provider value={{ admin, error, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

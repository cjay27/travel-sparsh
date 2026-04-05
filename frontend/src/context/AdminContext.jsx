import React, { createContext, useContext, useState, useCallback } from 'react';

// Demo admin credentials — replace with real API call in production
const ADMIN_CREDS = { email: 'admin@travelsparsh.com', password: 'Admin@123' };
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
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
      const session = { email, name: 'Admin', role: 'admin', loginAt: new Date().toISOString() };
      setAdmin(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setLoading(false);
      return true;
    }
    setError('Invalid admin credentials..');
    // Try admin@travelsparsh.com / Admin@123');
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
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

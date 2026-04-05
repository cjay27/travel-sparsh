import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('travel_sparsh_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('travel_sparsh_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
        localStorage.setItem('travel_sparsh_user', JSON.stringify(res.data.user));
      } catch {
        // Token invalid - clear everything
        setUser(null);
        setToken(null);
        localStorage.removeItem('travel_sparsh_token');
        localStorage.removeItem('travel_sparsh_user');
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('travel_sparsh_token', newToken);
      localStorage.setItem('travel_sparsh_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password, phone });
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('travel_sparsh_token', newToken);
      localStorage.setItem('travel_sparsh_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('travel_sparsh_token');
    localStorage.removeItem('travel_sparsh_user');
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;

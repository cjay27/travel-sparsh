import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PageLoader } from '../components/LoadingSpinner';
import { setLoaderCallback } from '../utils/api';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);
  const countRef = useRef(0);

  const showLoader = useCallback(() => {
    countRef.current += 1;
    setRequestCount(countRef.current);
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setRequestCount(countRef.current);
  }, []);

  useEffect(() => {
    // Register the local loading toggle to be called by Axios interceptors
    setLoaderCallback((isLoading) => {
      if (isLoading) showLoader();
      else hideLoader();
    });
    return () => setLoaderCallback(null);
  }, [showLoader, hideLoader]);

  const loading = requestCount > 0;

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm pointer-events-auto transition-all duration-300">
          <PageLoader />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within LoadingProvider');
  return context;
};

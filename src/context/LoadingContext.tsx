import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';

interface LoadingContextType {
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
  isSlowNetwork: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
  isSlowNetwork: false,
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memuat Halaman...');
  const location = useLocation();

  // Show loading manually
  const showLoading = (msg = 'Memuat Halaman...') => {
    setLoadingMessage(msg);
    setIsLoading(true);
  };

  // Hide loading manually
  const hideLoading = () => {
    setIsLoading(false);
    setIsSlowNetwork(false);
  };

  // 1. Initial Page Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // 2. Route Navigation Loading
  useEffect(() => {
    setIsLoading(true);
    setIsSlowNetwork(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 3. Network Listener (Online/Offline & Slow Connection Detection)
  useEffect(() => {
    const handleOffline = () => {
      setIsSlowNetwork(true);
      setIsLoading(true);
    };

    const handleOnline = () => {
      setIsSlowNetwork(false);
      setIsLoading(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Global fetch interceptor to detect slow network requests
    const originalFetch = window.fetch;
    let pendingRequests = 0;
    let slowTimer: NodeJS.Timeout | null = null;

    window.fetch = async (...args) => {
      pendingRequests++;

      // If request takes longer than 600ms, trigger slow network loading screen
      if (!slowTimer) {
        slowTimer = setTimeout(() => {
          if (pendingRequests > 0) {
            setIsSlowNetwork(true);
            setIsLoading(true);
          }
        }, 600);
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        pendingRequests--;
        if (pendingRequests <= 0) {
          if (slowTimer) {
            clearTimeout(slowTimer);
            slowTimer = null;
          }
          // Brief delay before hiding
          setTimeout(() => {
            if (pendingRequests <= 0) {
              setIsLoading(false);
              setIsSlowNetwork(false);
            }
          }, 200);
        }
      }
    };

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading, isSlowNetwork }}>
      {children}
      <LoadingScreen
        isLoading={isLoading}
        isSlowNetwork={isSlowNetwork}
        message={loadingMessage}
      />
    </LoadingContext.Provider>
  );
};

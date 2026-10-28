import React, { createContext, useContext, useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { api } from '../services/api';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface AppContextType {
  status: SystemStatus | null;
  loadingStatus: boolean;
  refreshStatus: () => Promise<void>;
  forceDemoMode: boolean;
  setForceDemoMode: (val: boolean) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [forceDemoMode, setForceDemoMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await api.getStatus();
      setStatus(res);
    } catch (err) {
      console.warn('Backend not responding to status check yet. Defaulting to demo mode indicator.');
      setStatus({
        live_ai_ready: false,
        configured_text_model: 'grok-2-1212',
        configured_vision_model: 'grok-2-vision-1212',
        force_demo_mode: true,
        database_connected: false,
        storage_type: 'Local'
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        status,
        loadingStatus,
        refreshStatus,
        forceDemoMode,
        setForceDemoMode,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

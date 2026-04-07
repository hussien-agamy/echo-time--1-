import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', id = Date.now()) => {
    setToasts((current) => [...current, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const typeConfig = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', iconColor: 'text-emerald-500' },
    error: { icon: AlertCircle, bg: 'bg-red-50 border-red-200 text-red-800', iconColor: 'text-red-500' },
    warning: { icon: Info, bg: 'bg-amber-50 border-amber-200 text-amber-800', iconColor: 'text-amber-500' },
    info: { icon: Info, bg: 'bg-blue-50 border-blue-200 text-blue-800', iconColor: 'text-blue-500' },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-2xl shadow-xl border ${config.bg}`}
    >
      <Icon className={`shrink-0 ${config.iconColor}`} size={20} />
      <p className="flex-1 text-sm font-bold leading-relaxed">{toast.message}</p>
      <button 
        onClick={onRemove}
        className={`shrink-0 hover:bg-black/5 rounded-full p-1 transition-colors ${config.iconColor}`}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

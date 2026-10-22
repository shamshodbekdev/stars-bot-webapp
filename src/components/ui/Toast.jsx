import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ message, type }) {
  const config = {
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  };

  const { icon: Icon, color, bg } = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-tg-secondaryBg border border-tg-hint/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
    >
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-sm font-medium flex-1">{message}</span>
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

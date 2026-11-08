/**
 * Toast notifications: success | error | info | warning.
 * Usage: const { showToast } = useToast(); showToast(text, 'success');
 */
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { haptic } from '../../lib/telegram';

const ToastContext = createContext(null);

const DURATION = 3000;
const MAX_VISIBLE = 3;

const TYPES = {
  success: { icon: CheckCircle2, color: 'text-emerald-500', haptic: 'success' },
  error: { icon: XCircle, color: 'text-red-500', haptic: 'error' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', haptic: 'warning' },
  info: { icon: Info, color: 'text-blue-500', haptic: null },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = ++nextId.current;
      const config = TYPES[type] ? type : 'info';
      if (TYPES[config].haptic) haptic.notify(TYPES[config].haptic);
      setToasts((list) => [...list, { id, message, type: config }].slice(-MAX_VISIBLE));
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ message, type, onClose }) {
  const { icon: Icon, color } = TYPES[type];

  return (
    <motion.div
      layout
      role="status"
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="pointer-events-auto w-full max-w-md flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lg shadow-black/5"
    >
      <Icon size={18} className={`${color} shrink-0`} />
      <span className="flex-1 text-sm font-medium leading-snug">{message}</span>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

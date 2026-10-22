import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={onClose}
        className="fixed top-4 left-4 right-4 z-50 bg-tg-secondaryBg border border-tg-hint/20 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg cursor-pointer"
      >
        {icons[type]}
        <span className="text-sm flex-1">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-tg-bg rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-tg-bg pt-3 pb-2 z-10">
              <div className="w-10 h-1 bg-tg-hint/30 rounded-full mx-auto" />
            </div>
            <div className="p-4 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

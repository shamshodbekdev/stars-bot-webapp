/**
 * Modal bottom sheet with spring animation, drag-to-dismiss, backdrop tap
 * and Escape key to close. Body scroll is locked while open.
 */
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const SPRING = { type: 'spring', stiffness: 380, damping: 36 };

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[90vh] max-w-lg flex-col rounded-t-3xl border-t border-line bg-bg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            {/* Drag handle + header */}
            <div className="shrink-0 cursor-grab px-4 pt-3 active:cursor-grabbing">
              <div className="mx-auto h-1 w-10 rounded-full bg-fg/15" />
              {title && (
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('common.close')}
                    className="-mr-1 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-fg/5"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div
              className="overflow-y-auto px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              onPointerDownCapture={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

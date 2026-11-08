import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { haptic } from '../../lib/telegram';

/**
 * Surface container. When `onClick` is given it renders as a button with a
 * subtle hover lift and press animation.
 */
export default function Card({ children, className, onClick, padded = true, ...props }) {
  const base = cn('bg-surface border border-line rounded-2xl', padded && 'p-4', className);

  if (!onClick) {
    return (
      <div className={base} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        haptic.impact('light');
        onClick(e);
      }}
      className={cn(base, 'w-full text-left transition-colors hover:border-fg/20')}
      {...props}
    >
      {children}
    </motion.button>
  );
}

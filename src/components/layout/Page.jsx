import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Page wrapper: consistent max width, bottom padding for the nav bar and a
 * short enter animation.
 */
export default function Page({ children, className }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('mx-auto min-h-screen max-w-lg pb-nav', className)}
    >
      {children}
    </motion.main>
  );
}

/** Standard horizontal padding + vertical rhythm for page content. */
export function Section({ children, className }) {
  return <div className={cn('space-y-4 px-4 py-4', className)}>{children}</div>;
}

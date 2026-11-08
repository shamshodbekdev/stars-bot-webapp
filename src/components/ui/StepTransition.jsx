import { motion } from 'framer-motion';

/**
 * Animates a wizard step in when `step` changes (enter-only: remounting via
 * `key` replays the animation without needing AnimatePresence exit handling).
 */
export default function StepTransition({ step, children }) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

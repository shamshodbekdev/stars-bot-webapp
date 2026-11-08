import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/** Accessible on/off toggle. */
export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
        checked ? 'bg-fg justify-end' : 'bg-fg/15 justify-start',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        className={cn('h-6 w-6 rounded-full shadow-sm', checked ? 'bg-inverse' : 'bg-white')}
      />
    </button>
  );
}

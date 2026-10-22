import { motion } from 'framer-motion';
import { Spinner } from '../icons';
import { cn } from '../../utils/cn';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon: Icon,
  loading = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90',
    secondary: 'bg-tg-secondaryBg text-tg-text border border-tg-hint/10 hover:bg-tg-hint/5',
    ghost: 'hover:bg-tg-secondaryBg text-tg-text',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        'rounded-xl font-semibold',
        'transition-all duration-150',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <Spinner size={18} />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
}

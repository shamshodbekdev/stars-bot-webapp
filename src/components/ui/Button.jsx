import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { triggerHaptic } from '../../utils/haptic';
import { playClickSound } from '../../utils/sound';

/** Visual variants */
const VARIANTS = {
  primary: 'bg-fg text-inverse hover:bg-fg/90',
  secondary: 'bg-surface text-fg border border-line hover:bg-fg/[0.03]',
  ghost: 'bg-transparent text-fg hover:bg-fg/5',
  danger: 'bg-red-600 text-white hover:bg-red-600/90',
  success: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-[15px] rounded-xl gap-2',
};

const ICON_SIZES = { sm: 16, md: 18, lg: 18 };

/**
 * Button with 5 variants, 3 sizes, optional leading icon and loading state.
 * While `loading` the button is disabled and shows a spinner.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  className,
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    triggerHaptic();
    playClickSound();
    onClick?.(e);
  };

  return (
    <motion.button
      type={type}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={ICON_SIZES[size]} className="animate-spin" />
      ) : (
        Icon && <Icon size={ICON_SIZES[size]} strokeWidth={2} />
      )}
      {children}
    </motion.button>
  );
}

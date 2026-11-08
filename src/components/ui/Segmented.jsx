import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { haptic } from '../../lib/telegram';

/**
 * Segmented control. options: [{ value, label, icon? }]
 * `layoutId` must be unique per instance on a page.
 */
export default function Segmented({ options, value, onChange, layoutId = 'segmented' }) {
  return (
    <div className="flex rounded-xl bg-fg/[0.06] p-1" role="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (!active) haptic.select();
              onChange(opt.value);
            }}
            className={cn(
              'relative flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors',
              active ? 'text-fg' : 'text-muted',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-surface shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {Icon && <Icon size={15} />}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import { cn } from '../../utils/cn';
import { triggerHaptic } from '../../utils/haptic';
import { playClickSound } from '../../utils/sound';

/**
 * Three circular step numbers, evenly spaced. Active step is filled
 * (black in light mode, white in dark mode); others are light gray.
 * Completed steps are clickable so the user can jump back.
 */
export default function StepIndicator({ step, labels = [], onStepClick }) {
  return (
    <div className="px-4 pt-5 pb-2">
      <ol className="flex items-start justify-between">
        {[1, 2, 3].map((s, i) => {
          const active = step === s;
          const canGoBack = s < step && onStepClick;
          return (
            <li key={s} className="flex w-1/3 flex-col items-center gap-2 first:items-start last:items-end">
              <button
                type="button"
                disabled={!canGoBack}
                onClick={() => {
                  if (!canGoBack) return;
                  triggerHaptic();
                  playClickSound();
                  onStepClick(s);
                }}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-colors duration-300',
                  active ? 'bg-fg text-inverse' : 'bg-fg/[0.06] text-muted',
                )}
              >
                {s}
              </button>
              <span
                className={cn(
                  'max-w-full text-xs leading-tight transition-colors duration-300',
                  i === 0 ? 'text-left' : i === 2 ? 'text-right' : 'text-center',
                  active ? 'font-semibold text-fg' : 'text-muted',
                )}
              >
                {labels[i]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

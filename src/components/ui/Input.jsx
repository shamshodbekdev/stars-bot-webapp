import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Text input with label, optional leading icon / prefix, trailing suffix,
 * hint text and validation error.
 */
const Input = forwardRef(function Input(
  { label, icon: Icon, prefix, suffix, hint, error, className, inputClassName, ...props },
  ref,
) {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-xl border bg-surface px-3.5 transition-colors',
          'focus-within:border-fg/40',
          error ? 'border-red-500/60' : 'border-line',
        )}
      >
        {Icon && <Icon size={18} className="shrink-0 text-muted" />}
        {prefix && <span className="text-[15px] text-muted">{prefix}</span>}
        <input
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/60',
            inputClassName,
          )}
          {...props}
        />
        {suffix && <span className="shrink-0 text-sm text-muted">{suffix}</span>}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
});

export default Input;

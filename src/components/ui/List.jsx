import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { haptic } from '../../lib/telegram';

/** Grouped list container with an optional section title. */
export function ListGroup({ title, children, className }) {
  return (
    <section className={className}>
      {title && (
        <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted">{title}</h2>
      )}
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {children}
      </div>
    </section>
  );
}

/**
 * A row inside ListGroup. Renders a button when `onClick` is given,
 * otherwise a plain row (e.g. with a Switch in `right`).
 */
export function ListItem({ icon: Icon, iconClassName, title, subtitle, right, onClick, danger }) {
  const content = (
    <>
      {Icon && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-fg/[0.05]">
          <Icon size={18} className={cn(danger ? 'text-red-500' : 'text-fg', iconClassName)} />
        </span>
      )}
      <span className="min-w-0 flex-1 text-left">
        <span className={cn('block truncate text-[15px] font-medium', danger && 'text-red-500')}>
          {title}
        </span>
        {subtitle && <span className="mt-0.5 block truncate text-xs text-muted">{subtitle}</span>}
      </span>
      {right ?? (onClick && <ChevronRight size={18} className="shrink-0 text-muted/60" />)}
    </>
  );

  const base = 'flex w-full items-center gap-3 px-4 py-3.5';

  if (!onClick) return <div className={base}>{content}</div>;

  return (
    <button
      type="button"
      onClick={() => {
        haptic.impact('light');
        onClick();
      }}
      className={cn(base, 'transition-colors hover:bg-fg/[0.03] active:bg-fg/[0.05]')}
    >
      {content}
    </button>
  );
}

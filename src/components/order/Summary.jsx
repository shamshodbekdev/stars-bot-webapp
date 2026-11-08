import { cn } from '../../utils/cn';

/** Key/value rows used on confirmation screens. */
export function Summary({ children }) {
  return <dl className="divide-y divide-line rounded-2xl border border-line bg-surface px-4">{children}</dl>;
}

export function SummaryRow({ label, value, strong, danger }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd
        className={cn(
          'truncate text-right',
          strong ? 'text-base font-semibold' : 'font-medium',
          danger && 'text-red-500',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

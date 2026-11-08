import { cn } from '../../utils/cn';

/** Generic shimmering placeholder block. */
export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />;
}

/** Placeholder for a stat card. */
export function CardSkeleton({ className }) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-4', className)}>
      <Skeleton className="mb-3 h-3 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  );
}

/** Placeholder for a list of rows. */
export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

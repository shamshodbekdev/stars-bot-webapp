/**
 * Price display helpers for admin-set discounts (bot admin panel → Narxlar).
 */
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';
import { formatSom } from '../../utils/format';

/** "−10%" pill */
export function DiscountBadge({ percent, className }) {
  const { t } = useLanguage();
  if (!percent) return null;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400',
        className,
      )}
    >
      {t('order.discount_badge', { percent })}
    </span>
  );
}

/** Final price, with the base price struck through when a discount applies. */
export function PriceTag({ price, basePrice, som, className }) {
  const discounted = basePrice != null && basePrice > price;
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      {discounted && <s className="text-xs font-normal text-muted">{formatSom(basePrice, som)}</s>}
      <span>{formatSom(price, som)}</span>
    </span>
  );
}

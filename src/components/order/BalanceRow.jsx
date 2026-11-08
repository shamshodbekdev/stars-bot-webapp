import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { formatSom } from '../../utils/format';
import { Skeleton } from '../ui/Skeleton';
import { SummaryRow } from './Summary';

/** Summary row showing the current balance; red when it can't cover `price`. */
export default function BalanceRow({ price }) {
  const { t } = useLanguage();
  const { profile, loading } = useUser();
  const balance = profile?.balance ?? 0;

  return (
    <SummaryRow
      label={t('order.your_balance')}
      value={loading ? <Skeleton className="h-4 w-20" /> : formatSom(balance, t('common.som'))}
      danger={!loading && balance < price}
    />
  );
}

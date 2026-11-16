import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../components/ui/Toast';
import { useApiError } from './useApiError';
import { haptic } from '../lib/telegram';
import { loadShopConfig } from './useShopConfig';
import { showPendingOrder } from './usePendingOrder';

/**
 * Creates an order and handles the common outcomes:
 * loading state, error toasts, balance refresh, the "insufficient balance"
 * redirect to the top-up page and — on success — the full-screen pending
 * screen with the 5-minute countdown (components/order/OrderPending.jsx).
 * Resolves to true when the order was created.
 */
export function usePurchase() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { refresh } = useUser();
  const navigate = useNavigate();
  const errorMessage = useApiError();

  const purchase = useCallback(
    async (order) => {
      setLoading(true);
      try {
        const res = await api.createOrder(order);
        haptic.notify('success');
        if (res?.order) showPendingOrder(res.order);
        else showToast(t('toast.order_created'), 'success');
        refresh();
        return true;
      } catch (err) {
        if (err.code === 'insufficient_balance') {
          showToast(t('errors.insufficient_balance'), 'warning');
          navigate('/balance');
        } else {
          // Prices moved since the page was opened: show the new ones.
          if (err.code === 'price_changed') loadShopConfig({ force: true });
          showToast(errorMessage(err), 'error');
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, showToast, refresh, navigate, errorMessage],
  );

  return { purchase, loading };
}

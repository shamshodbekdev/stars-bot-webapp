import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../components/ui/Toast';
import { useApiError } from './useApiError';

/**
 * Creates an order and handles the common outcomes:
 * loading state, success / error toasts, balance refresh and the
 * "insufficient balance" redirect to the top-up page.
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
        await api.createOrder(order);
        showToast(t('toast.order_created'), 'success');
        refresh();
        return true;
      } catch (err) {
        if (err.code === 'insufficient_balance') {
          showToast(t('errors.insufficient_balance'), 'warning');
          navigate('/balance');
        } else {
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

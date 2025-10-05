import { useState, useCallback } from 'react';
import { deletePromotionRequest } from '../../../../services/promotionService';


export default function useDeletePromotion() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deletePromotion = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deletePromotionRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting promotion');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return { deletePromotion, loading, success, error, reset };
};
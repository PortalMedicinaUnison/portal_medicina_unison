import { useState } from 'react';
import { deletePromotionRequest } from '../../../../services/promotionService';

export default function useDeletePromotion() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const deletePromotion = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deletePromotionRequest(id);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError('');
  };

  return { deletePromotion, loading, success, error, reset };
}

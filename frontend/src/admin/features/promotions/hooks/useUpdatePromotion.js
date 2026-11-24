import { useState, useCallback } from 'react';
import { updatePromotionRequest } from '../../../../services/promotionService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useUpdatePromotion() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updatePromotion = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePromotionRequest(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updatePromotion, loading, error, success, reset };
}
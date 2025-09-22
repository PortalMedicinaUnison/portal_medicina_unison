import { useState, useEffect, useCallback } from 'react';
import { getPromotionByIdRequest } from '../../../../services/promotionService';


export default function usePromotion(id) {
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const getPromotion = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPromotionByIdRequest(id);
      setPromotion(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching promotion');
      setPromotion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setPromotion(null);
      setError(null);
      setLoading(false);
      return;
    }
    getPromotion(id);
  }, [id, getPromotion]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getPromotion(id);
  }, [id, getPromotion]);

  return { promotion, loading, error, refetch, getPromotion };
};
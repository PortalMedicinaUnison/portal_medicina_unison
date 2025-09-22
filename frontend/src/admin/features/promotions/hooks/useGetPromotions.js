import { useState, useEffect, useCallback } from 'react';
import { getAllPromotionsRequest } from '../../../../services/promotionService'


export default function useGetPromotions () {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const getPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPromotionsRequest();
      setPromotions(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getPromotions();
  }, [getPromotions]);
    
  return { promotions, loading, error, refetch: getPromotions };
};
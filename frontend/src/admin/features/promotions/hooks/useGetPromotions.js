import { useState, useEffect, useCallback } from 'react';
import { getAllPromotionsRequest } from '../../../../services/promotionService'
import { getErrorMessage } from '../../../../utils/errors';


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
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
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
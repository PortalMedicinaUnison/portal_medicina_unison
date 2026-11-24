import { useState, useEffect, useCallback } from 'react';
import { getAllPromotionsRequest } from '../../../../services/promotionService'
import { getErrorMessage } from '../../../../utils/errors';


// program: 1 internado, 2 servicio social; sin valor trae ambos.
export default function useGetPromotions ({ program } = {}) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const getPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPromotionsRequest(program ? { program } : {});
      setPromotions(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [program]);
    
  useEffect(() => {
    getPromotions();
  }, [getPromotions]);
    
  return { promotions, loading, error, refetch: getPromotions };
};
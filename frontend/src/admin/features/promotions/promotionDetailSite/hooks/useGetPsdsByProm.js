import { useState, useEffect, useCallback } from 'react';
import { getPsdsByPromotionIdRequest } from '../../../../../services/promotionService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useGetPsdsByProm(id) {
  const [psds, setPsds] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getPsdByProm = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPsdsByPromotionIdRequest(id);
      setPsds(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setPsds(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setPsds(null);
      setError(null);
      setLoading(false);
      return;
    }
    getPsdByProm(id);
  }, [id, getPsdByProm]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getPsdByProm(id);
  }, [id, getPsdByProm]);

  return { psds, loading, error, refetch, getPsdByProm };
};
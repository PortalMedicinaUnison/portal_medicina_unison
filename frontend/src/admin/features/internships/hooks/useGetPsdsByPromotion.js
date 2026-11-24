import { useState, useEffect, useCallback } from 'react';
import { getAllPsdsRequest } from '../../../../services/promotionService';
import { getErrorMessage } from '../../../../utils/errors';


// Sedes con cupo en una promoción; cada cupo incluye `capacity` y `occupied`.
export default function useGetPsdsByPromotion(promotionId) {
  const [psds, setPsds]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getPsds = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPsdsRequest({ promotion_id: id });
      setPsds(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las sedes de la promoción.'));
      setPsds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!promotionId) {
      setPsds([]);
      setError(null);
      setLoading(false);
      return;
    }
    getPsds(promotionId);
  }, [promotionId, getPsds]);

  const refetch = useCallback(() => {
    if (!promotionId) return Promise.resolve();
    return getPsds(promotionId);
  }, [promotionId, getPsds]);

  return { psds, loading, error, refetch };
}

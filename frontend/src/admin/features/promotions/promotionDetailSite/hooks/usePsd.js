import { useState, useEffect, useCallback } from 'react';
import { getPsdByIdRequest } from '../../../../../services/promotionService';


export default function usePsd(id) {
  const [psd, setPsd]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getPsd = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPsdByIdRequest(id);
      setPsd(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching promotion site detail');
      setPsd(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setPsd(null);
      setError(null);
      setLoading(false);
      return;
    }
    getPsd(id);
  }, [id, getPsd]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getPsd(id);
  }, [id, getPsd]);

  return { psd, loading, error, refetch, getPsd };
};
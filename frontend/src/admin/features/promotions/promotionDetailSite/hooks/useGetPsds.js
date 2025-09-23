import { useState, useEffect, useCallback } from 'react';
import { getAllPsdsRequest } from '../../../../../services/promotionService'


export default function useGetPsds () {
  const [psds, setPsds] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const getPsds = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPsdsRequest();
      setPsds(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching promotion site details');
      setPsds([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getPsds();
  }, [getPsds]);
    
  return { psds, loading, error, refetch: getPsds };
};
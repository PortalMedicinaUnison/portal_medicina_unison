import { useState, useEffect } from 'react';
import { getAllPsdsRequest } from '../../../../../services/promotionService';

const useGetPsds = () => {
  const [psds, setPsds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPsds = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPsdsRequest();
      setPsds(response.data);
    } catch (err) {
      console.error('Error fetching promotion site details:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsds();
  }, []);

  return { psds, loading, error, refetch: fetchPsds };
};

export default useGetPsds;
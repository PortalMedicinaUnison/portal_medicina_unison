import { useState, useEffect } from 'react';
import api from '../../../../api';


const useGetPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/promotions');
      setPromotions(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return { promotions, loading, error, refetch: fetchPromotions };
};

export default useGetPromotions;
import { useState, useEffect } from 'react';
import { getAllPromotionsRequest } from '../../../../services/promotionService';

const useGetPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPromotionsRequest();
      setPromotions(response.data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err.message);
      return false;
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
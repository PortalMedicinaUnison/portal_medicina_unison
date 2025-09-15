import { useState, useEffect } from 'react';
import api from '../../../../../api';


const useGetSites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/sites');
      setSites(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return { sites, loading, error, refetch: fetchSites };
};

export default useGetSites;
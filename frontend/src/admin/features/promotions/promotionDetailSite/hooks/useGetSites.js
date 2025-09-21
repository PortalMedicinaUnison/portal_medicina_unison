import { useState, useEffect } from 'react';
import { getAllSitesRequest } from '../../../../../services/siteService'; 

const useGetSites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSitesRequest();
      setSites(response.data);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(err?.message);
      return false;
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

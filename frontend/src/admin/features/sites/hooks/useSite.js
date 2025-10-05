import { useState, useEffect, useCallback } from 'react';
import { getSiteByIdRequest } from '../../../../services/siteService';


export default function useSite(id) {
  const [site, setSite]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getSite = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSiteByIdRequest(id);
      setSite(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching site');
      setSite(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setSite(null);
      setError(null);
      setLoading(false);
      return;
    }
    getSite(id);
  }, [id, getSite]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getSite(id);
  }, [id, getSite]);

  return { site, loading, error, refetch, getSite };
};
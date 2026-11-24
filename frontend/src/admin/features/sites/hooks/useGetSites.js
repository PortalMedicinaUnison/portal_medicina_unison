import { useState, useEffect, useCallback } from 'react';
import { getAllSitesRequest } from '../../../../services/siteService'
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetSites () {
  const [sites, setSites]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllSitesRequest();
      setSites(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getSites();
  }, [getSites]);
    
  return { sites, loading, error, refetch: getSites };
};
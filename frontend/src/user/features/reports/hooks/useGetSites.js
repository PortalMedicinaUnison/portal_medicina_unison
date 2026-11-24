import { useState, useEffect, useCallback } from 'react';
import { getAllSitesRequest } from '../../../../services/siteService';
import { getErrorMessage } from '../../../../utils/errors';


// Catálogo de sedes para el formulario de reportes (el backend las devuelve ordenadas por nombre).
export default function useGetSites() {
  const [sites, setSites]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const getSites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSitesRequest();
      setSites(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las sedes.'));
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSites();
  }, [getSites]);

  return { sites, loading, error, refetch: getSites };
}

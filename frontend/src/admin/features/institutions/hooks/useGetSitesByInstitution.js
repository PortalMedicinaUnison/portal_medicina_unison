import { useState, useEffect, useCallback } from 'react';
import { getAllSitesRequest } from '../../../../services/siteService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetSitesByInstitution(institutionId) {
  const [sites, setSites]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getSites = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSitesRequest({ institution_id: id });
      setSites(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las sedes.'));
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!institutionId) {
      setSites([]);
      setError(null);
      setLoading(false);
      return;
    }
    getSites(institutionId);
  }, [institutionId, getSites]);

  const refetch = useCallback(() => {
    if (!institutionId) return Promise.resolve();
    return getSites(institutionId);
  }, [institutionId, getSites]);

  return { sites, loading, error, refetch };
}

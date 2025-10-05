import { useState, useEffect, useCallback } from 'react';
import { getInstitutionByIdRequest } from '../../../../services/siteService';


export default function useInstitution(id) {
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const getInstitution = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInstitutionByIdRequest(id);
      setInstitution(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching institution');
      setInstitution(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setInstitution(null);
      setError(null);
      setLoading(false);
      return;
    }
    getInstitution(id);
  }, [id, getInstitution]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getInstitution(id);
  }, [id, getInstitution]);

  return { institution, loading, error, refetch, getInstitution };
};
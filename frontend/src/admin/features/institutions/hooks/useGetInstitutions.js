import { useState, useEffect, useCallback } from 'react';
import { getAllInstitutionsRequest } from '../../../../services/siteService'


export default function useGetInstitutions () {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllInstitutionsRequest();
      setInstitutions(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching institutions');
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getInstitutions();
  }, [getInstitutions]);
    
  return { institutions, loading, error, refetch: getInstitutions };
};
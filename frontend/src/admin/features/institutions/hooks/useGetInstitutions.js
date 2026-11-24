import { useState, useEffect, useCallback } from 'react';
import { getAllInstitutionsRequest } from '../../../../services/siteService'
import { getErrorMessage } from '../../../../utils/errors';


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
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
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
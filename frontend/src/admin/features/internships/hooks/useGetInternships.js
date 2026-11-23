import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipsRequest } from '../../../../services/internshipService'
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetInternships () {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const getInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllInternshipsRequest();
      setInternships(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getInternships();
  }, [getInternships]);
    
  return { internships, loading, error, refetch: getInternships };
};
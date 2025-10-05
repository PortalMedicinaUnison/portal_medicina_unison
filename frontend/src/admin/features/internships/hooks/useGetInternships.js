import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipsRequest } from '../../../../services/internshipService'


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
      setError(err.response?.data?.detail || 'Error fetching internships');
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
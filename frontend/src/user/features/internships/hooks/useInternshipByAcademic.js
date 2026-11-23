import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipsRequest } from '../../../../services/internshipService';


export default function useInternshipByAcademic(id) {
  const [internship, setInternship] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const getInternship = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      // El backend devuelve solo los internados del estudiante, del más reciente al más antiguo.
      const response = await getAllInternshipsRequest();
      setInternship(response.data[0] ?? null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching internship');
      setInternship(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setInternship(null);
      setError(null);
      setLoading(false);
      return;
    }
    getInternship(id);
  }, [id, getInternship]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getInternship(id);
  }, [id, getInternship]);

  return { internship, loading, error, refetch, getInternship };
};
import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipApplicationsRequest } from '../../../../services/internshipService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useApplicationByAcademic(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const getApplication = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      // El backend devuelve solo las asignaciones del estudiante, de la más reciente a la más antigua.
      const response = await getAllInternshipApplicationsRequest();
      setApplication(response.data[0] ?? null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setApplication(null);
      setError(null);
      setLoading(false);
      return;
    }
    getApplication(id);
  }, [id, getApplication]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getApplication(id);
  }, [id, getApplication]);

  return { application, loading, error, refetch, getApplication };
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllInternshipApplicationsRequest } from '../../../../services/internshipService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useApplicationByAcademic(id) {
  const [application, setApplication] = useState(null);
  // Con un id se empieza cargando: así no se muestra "no encontrado" antes de la primera petición.
  const [loading, setLoading]         = useState(Boolean(id));
  const [error, setError]             = useState(null);
  const loadedRef = useRef(false);

  const getApplication = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    // Al refrescar (p. ej. tras subir un documento) no se vuelve a "cargando": la página no se desmonta.
    if (!loadedRef.current) setLoading(true);
    setError(null);
    
    try {
      // El backend devuelve solo las asignaciones del estudiante, de la más reciente a la más antigua.
      const response = await getAllInternshipApplicationsRequest();
      setApplication(response.data[0] ?? null);
      loadedRef.current = true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar tu asignación.'));
      setApplication(null);
      loadedRef.current = false;
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
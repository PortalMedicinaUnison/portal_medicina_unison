import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllSocialServiceApplicationsRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


/**
 * Asignación de servicio social más reciente del estudiante (o null si todavía no tiene una).
 * `id` es el expediente del estudiante en sesión: sin él no se hace la petición.
 */
export default function useSocialServiceApplicationByAcademic(id) {
  const [application, setApplication] = useState(null);
  // Con un id se empieza cargando: así no se muestra "sin asignación" antes de la primera petición.
  const [loading, setLoading]         = useState(Boolean(id));
  const [error, setError]             = useState(null);
  const loadedRef = useRef(false);

  const getApplication = useCallback(async () => {
    // Al refrescar (p. ej. tras subir un documento) no se vuelve a "cargando": la página no se desmonta.
    if (!loadedRef.current) setLoading(true);
    setError(null);

    try {
      // El backend devuelve solo las asignaciones del estudiante, de la más reciente a la más antigua.
      const response = await getAllSocialServiceApplicationsRequest();
      setApplication(response.data[0] ?? null);
      loadedRef.current = true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar tu asignación de servicio social.'));
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
    getApplication();
  }, [id, getApplication]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getApplication();
  }, [id, getApplication]);

  return { application, loading, error, refetch };
}

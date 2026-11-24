import { useState, useEffect, useCallback } from 'react';
import { getAllSocialServicesRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


/**
 * Servicio social más reciente del estudiante (o null si todavía no acepta una asignación).
 * `id` es el expediente del estudiante en sesión: sin él no se hace la petición.
 */
export default function useSocialServiceByAcademic(id) {
  const [socialService, setSocialService] = useState(null);
  // Con un id se empieza cargando: así no se muestra "sin servicio social" antes de la primera petición.
  const [loading, setLoading]             = useState(Boolean(id));
  const [error, setError]                 = useState(null);

  const getSocialService = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // El backend devuelve solo los servicios sociales del estudiante, del más reciente al más antiguo.
      const response = await getAllSocialServicesRequest();
      setSocialService(response.data[0] ?? null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar tu servicio social.'));
      setSocialService(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setSocialService(null);
      setError(null);
      setLoading(false);
      return;
    }
    getSocialService();
  }, [id, getSocialService]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getSocialService();
  }, [id, getSocialService]);

  return { socialService, loading, error, refetch };
}

import { useState, useCallback } from 'react';
import {
  acceptInternshipApplicationRequest,
  declineInternshipApplicationRequest,
} from '../../../../services/internshipService';
import { getErrorMessage } from '../../../../utils/errors';

/**
 * Respuesta del estudiante a su asignación. Aceptar crea el internado en el backend
 * en la misma operación (ya no se hacen dos peticiones separadas).
 */
export default function useRespondApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null); // 'accepted' | 'declined' | null

  const respond = useCallback(async (applicationId, accept) => {
    if (loading) return null;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = accept
        ? await acceptInternshipApplicationRequest(applicationId)
        : await declineInternshipApplicationRequest(applicationId);
      setResult(accept ? 'accepted' : 'declined');
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo registrar tu respuesta.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const accept = useCallback((applicationId) => respond(applicationId, true), [respond]);
  const decline = useCallback((applicationId) => respond(applicationId, false), [respond]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { accept, decline, loading, error, result, reset };
}

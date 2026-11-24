import { useState, useCallback } from 'react';
import { bulkCreateUserEnrollmentsRequest } from '../../../../../services/userService';
import { getErrorMessage } from '../../../../../utils/errors';


// Pre-registra varios expedientes en una sola petición.
// El backend responde { created, skipped, invalid } (listas de expedientes).
export default function useBulkCreateEnrollments() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  // Devuelve el resumen de la importación o null si falló.
  const bulkCreateEnrollments = useCallback(async (academicIds) => {
    if (loading) return null;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await bulkCreateUserEnrollmentsRequest(academicIds);
      setResult(response.data);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron importar los expedientes.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { bulkCreateEnrollments, loading, error, result, success: result !== null, reset };
}

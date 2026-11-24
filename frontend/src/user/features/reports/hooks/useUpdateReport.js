import { useState, useCallback } from 'react';
import { updateReportRequest } from '../../../../services/reportService';
import { getErrorMessage } from '../../../../utils/errors';


// El backend solo permite editar mientras el reporte siga abierto (si no, responde 409).
export default function useUpdateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateReport = useCallback(async (id, payload) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateReportRequest(id, payload);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updateReport, loading, error, success, reset };
}

import { useState, useCallback } from 'react';
import { setReportStatusRequest } from '../../../../services/reportService';
import { getErrorMessage } from '../../../../utils/errors';


// Cierra (isOpen = false) o reabre (isOpen = true) un reporte. Solo administración.
export default function useSetReportStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const setReportStatus = useCallback(async (id, isOpen) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await setReportStatusRequest(id, isOpen);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar el estatus del reporte.'));
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

  return { setReportStatus, loading, error, success, reset };
}

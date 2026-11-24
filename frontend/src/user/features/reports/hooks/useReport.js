import { useState, useEffect, useCallback } from 'react';
import { getReportByIdRequest } from '../../../../services/reportService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useReport(id) {
  const [report, setReport]   = useState(null);
  // Con id arranca cargando: así no se muestra el estado "no encontrado" antes de la primera petición.
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError]     = useState(null);

  const getReport = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getReportByIdRequest(id);
      setReport(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setReport(null);
      setError(null);
      setLoading(false);
      return;
    }
    getReport(id);
  }, [id, getReport]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getReport(id);
  }, [id, getReport]);

  return { report, loading, error, refetch, getReport };
};
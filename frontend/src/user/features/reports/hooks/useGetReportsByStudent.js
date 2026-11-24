import { useState, useEffect, useCallback } from 'react';
import { getMyReportsRequest } from '../../../../services/reportService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetReportsByStudent(id) {
  const [reports, setReports] = useState(null);
  // Con id arranca cargando: así no se muestra la lista vacía antes de la primera petición.
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError]     = useState(null);

  const getReportsByStudent = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMyReportsRequest();
      setReports(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setReports(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setReports(null);
      setError(null);
      setLoading(false);
      return;
    }
    getReportsByStudent(id);
  }, [id, getReportsByStudent]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getReportsByStudent(id);
  }, [id, getReportsByStudent]);

  return { reports, loading, error, refetch, getReportsByStudent };
};
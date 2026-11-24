import { useState, useEffect, useCallback } from 'react';
import { getAllReportsRequest } from '../../../../services/reportService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllReportsRequest();
      setReports(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getReports();
  }, [getReports]);

  return { reports, loading, error, refetch: getReports };
}

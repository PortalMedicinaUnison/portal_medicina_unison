import { useState, useEffect, useCallback } from 'react';
import { getReportByIdRequest } from '../../../../services/reportService';


export default function useReport(id) {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getReport = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getReportByIdRequest(id);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching report');
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
import { useState, useEffect, useCallback } from 'react';
import { getReportsByStudentRequest } from '../../../../services/reportService';


export default function useGetPsdsByProm(id) {
  const [reports, setReports]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getReportsByStudent = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getReportsByStudentRequest(id);
      setReports(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching reports');
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
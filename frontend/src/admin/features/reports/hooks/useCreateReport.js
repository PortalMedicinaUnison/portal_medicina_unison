import { useState, useCallback } from 'react';
import { createReportRequest } from '../../../../services/reportService';


export default function useCreateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createReport = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createReportRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating report');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createReport, loading, error, success, reset };
}
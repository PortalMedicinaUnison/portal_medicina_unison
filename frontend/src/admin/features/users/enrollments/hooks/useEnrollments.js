import { useState, useEffect, useCallback } from 'react';
import { getUserEnrollmentByIdRequest } from '../../../../../services/userService';


export default function useEnrollments(id) {
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const getEnrollment = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserEnrollmentByIdRequest(id);
      setEnrollment(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching enrollment');
      setEnrollment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setEnrollment(null);
      setError(null);
      setLoading(false);
      return;
    }
    getEnrollment(id);
  }, [id, getEnrollment]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getEnrollment(id);
  }, [id, getEnrollment]);

  return { enrollment, loading, error, refetch, getEnrollment };
};
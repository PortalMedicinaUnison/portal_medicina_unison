import { useState, useEffect, useCallback } from 'react';
import { getAllUserEnrollmentsRequest } from '../../../../../services/userService'


export default function useGetEnrollments () {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const getEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUserEnrollmentsRequest();
      setEnrollments(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching enrollments');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getEnrollments();
  }, [getEnrollments]);
    
  return { enrollments, loading, error, refetch: getEnrollments };
};
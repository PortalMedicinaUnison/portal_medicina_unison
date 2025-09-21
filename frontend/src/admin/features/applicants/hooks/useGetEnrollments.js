import { useState, useEffect } from 'react';
import { getAllEnrollmentsRequest } from '../../../../services/internshipService';

const useGetEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllEnrollmentsRequest();
      setEnrollments(response.data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return { enrollments, loading, error, refetch: fetchEnrollments };
};

export default useGetEnrollments;
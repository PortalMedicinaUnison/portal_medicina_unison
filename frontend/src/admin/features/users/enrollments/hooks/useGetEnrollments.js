import { useState, useEffect } from 'react';
import { getAllUserEnrollmentsRequest } from '../../../../../services/userService';

const useGetUserEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUserEnrollmentsRequest();
      setEnrollments(response.data);
    } catch (err) {
      console.error('Error fetching user enrollments:', err);
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

export default useGetUserEnrollments;
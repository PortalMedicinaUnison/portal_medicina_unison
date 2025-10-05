import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipApplicationsRequest } from '../../../../services/internshipService'


export default function useGetApplications () {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllInternshipApplicationsRequest();
      setApplications(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getApplications();
  }, [getApplications]);
    
  return { applications, loading, error, refetch: getApplications };
};
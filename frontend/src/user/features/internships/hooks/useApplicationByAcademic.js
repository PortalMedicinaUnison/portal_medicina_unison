import { useState, useEffect, useCallback } from 'react';
import { getInternshipApplicationsLatestByAcademicRequest } from '../../../../services/internshipService';


export default function useApplicationByAcademic(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const getApplication = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInternshipApplicationsLatestByAcademicRequest(id);
      setApplication(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching application');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setApplication(null);
      setError(null);
      setLoading(false);
      return;
    }
    getApplication(id);
  }, [id, getApplication]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getApplication(id);
  }, [id, getApplication]);

  return { application, loading, error, refetch, getApplication };
};
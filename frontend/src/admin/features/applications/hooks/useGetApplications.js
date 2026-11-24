import { useState, useEffect, useCallback } from 'react';
import { getAllInternshipApplicationsRequest } from '../../../../services/internshipService'
import { getErrorMessage } from '../../../../utils/errors';


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
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
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
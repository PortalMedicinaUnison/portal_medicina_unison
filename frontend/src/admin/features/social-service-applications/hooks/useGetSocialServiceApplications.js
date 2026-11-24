import { useState, useEffect, useCallback } from 'react';
import { getAllSocialServiceApplicationsRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetSocialServiceApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const getApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSocialServiceApplicationsRequest();
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
}

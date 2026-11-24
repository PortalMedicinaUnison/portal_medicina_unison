import { useState, useEffect, useCallback } from 'react';
import { getAllSocialServicesRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useGetSocialServices() {
  const [socialServices, setSocialServices] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const getSocialServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSocialServicesRequest();
      setSocialServices(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setSocialServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSocialServices();
  }, [getSocialServices]);

  return { socialServices, loading, error, refetch: getSocialServices };
}

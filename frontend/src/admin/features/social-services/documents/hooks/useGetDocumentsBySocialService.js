import { useState, useEffect, useCallback } from 'react';
import { getDocumentsBySocialServiceRequest } from '../../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useGetDocumentsBySocialService(socialServiceId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(Boolean(socialServiceId));
  const [error, setError]         = useState(null);

  const getDocuments = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getDocumentsBySocialServiceRequest(id);
      setDocuments(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los documentos.'));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!socialServiceId) {
      setDocuments([]);
      setError(null);
      setLoading(false);
      return;
    }
    getDocuments(socialServiceId);
  }, [socialServiceId, getDocuments]);

  const refetch = useCallback(() => {
    if (!socialServiceId) return Promise.resolve();
    return getDocuments(socialServiceId);
  }, [socialServiceId, getDocuments]);

  return { documents, loading, error, refetch };
}

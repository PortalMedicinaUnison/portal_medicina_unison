import { useState, useEffect, useCallback } from 'react';
import { getDocumentsByInternshipRequest } from '../../../../../services/internshipService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useGetDocumentsByInternship(internshipId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const getDocuments = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getDocumentsByInternshipRequest(id);
      setDocuments(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los documentos.'));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!internshipId) {
      setDocuments([]);
      setError(null);
      setLoading(false);
      return;
    }
    getDocuments(internshipId);
  }, [internshipId, getDocuments]);

  const refetch = useCallback(() => {
    if (!internshipId) return Promise.resolve();
    return getDocuments(internshipId);
  }, [internshipId, getDocuments]);

  return { documents, loading, error, refetch };
}

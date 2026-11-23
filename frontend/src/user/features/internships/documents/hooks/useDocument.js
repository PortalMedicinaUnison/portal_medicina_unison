import { useState, useEffect, useCallback } from 'react';
import { getInternshipDocumentByIdRequest } from '../../../../../services/internshipService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useDocument(internshipId, docId) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const getDocument = useCallback(async () => {
    if (!internshipId || !docId) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInternshipDocumentByIdRequest(internshipId, docId);
      setDocument(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, [internshipId, docId]);

  useEffect(() => {
    if (!internshipId || !docId) {
      setDocument(null);
      setError(null);
      setLoading(false);
      return;
    }
    getDocument(internshipId, docId);
  }, [internshipId, docId, getDocument]);

  const refetch = useCallback(() => getDocument(), [getDocument]);

  return { document, loading, error, refetch, getDocument };
};
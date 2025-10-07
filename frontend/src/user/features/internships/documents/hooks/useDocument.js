import { useState, useEffect, useCallback } from 'react';
import { getInternshipDocumentByIdRequest } from '../../../../../services/internshipService';


export default function useDocument(id) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getDocument = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInternshipDocumentByIdRequest(id);
      setDocument(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching document');
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setDocument(null);
      setError(null);
      setLoading(false);
      return;
    }
    getDocument(id);
  }, [id, getDocument]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getDocument(id);
  }, [id, getDocument]);

  return { document, loading, error, refetch, getDocument };
};
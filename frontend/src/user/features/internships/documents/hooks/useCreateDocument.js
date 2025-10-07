import { useState, useCallback } from 'react';
import { createInternshipDocumentRequest } from '../../../../../services/internshipService';


export default function useCreateDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createDocument = useCallback(async (payload) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createInternshipDocumentRequest(payload);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating document');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createDocument, loading, error, success, reset };
}
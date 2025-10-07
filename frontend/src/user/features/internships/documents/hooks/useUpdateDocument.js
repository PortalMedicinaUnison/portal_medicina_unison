import { useState, useCallback } from 'react';
import { updateInternshipDocumentRequest } from '../../../../../services/internshipService';


export default function useUpdateDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateDocument = useCallback(async (id, payload) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateInternshipDocumentRequest(id, payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating document');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updateDocument, loading, error, success, reset };
}
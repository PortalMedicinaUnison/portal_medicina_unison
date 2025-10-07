import { useState, useCallback } from 'react';
import { deleteInternshipDocumentRequest } from '../../../../../services/internshipService';


export default function useDeleteDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteDocument = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteInternshipDocumentRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting document');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return { deleteDocument, loading, success, error, reset };
};
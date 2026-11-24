import { useState, useCallback } from 'react';
import { deleteInternshipDocumentRequest } from '../../../../../services/internshipService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useDeleteDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteDocument = useCallback(async (internshipId, docId) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteInternshipDocumentRequest(internshipId, docId);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el documento.'));
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
}

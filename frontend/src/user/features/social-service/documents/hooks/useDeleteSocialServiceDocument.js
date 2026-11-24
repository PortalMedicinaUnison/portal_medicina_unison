import { useState, useCallback } from 'react';
import { deleteSocialServiceDocumentRequest } from '../../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useDeleteSocialServiceDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteDocument = useCallback(async (socialServiceId, docId) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteSocialServiceDocumentRequest(socialServiceId, docId);
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

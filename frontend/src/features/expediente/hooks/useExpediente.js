import { useCallback, useEffect, useState } from 'react';
import {
  deleteExpedienteDocumentRequest,
  getDocumentRequirementsRequest,
  getExpedienteRequest,
  reviewExpedienteDocumentRequest,
  uploadExpedienteDocumentRequest,
} from '../../../services/documentService';
import { getErrorMessage } from '../../../utils/errors';


/**
 * Catálogo del programa + documentos subidos al expediente de una asignación, con las acciones
 * (subir, eliminar, revisar). Después de cada acción se vuelve a cargar el expediente.
 */
export default function useExpediente(program, applicationId) {
  const [requirements, setRequirements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);      // requisito o documento en proceso
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    if (!applicationId) return;
    setError(null);
    try {
      const [catalog, expediente] = await Promise.all([
        getDocumentRequirementsRequest({ program }),
        getExpedienteRequest(program, applicationId),
      ]);
      setRequirements(catalog.data);
      setDocuments(expediente.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los documentos.'));
    } finally {
      setLoading(false);
    }
  }, [program, applicationId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = useCallback(async (key, action, fallback) => {
    setBusyKey(key);
    setActionError(null);
    try {
      await action();
      await load();
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err, fallback));
      return false;
    } finally {
      setBusyKey(null);
    }
  }, [load]);

  const upload = useCallback((requirementId, file) => run(
    `req-${requirementId}`,
    () => uploadExpedienteDocumentRequest(program, applicationId, requirementId, file),
    'No se pudo subir el documento.',
  ), [run, program, applicationId]);

  const remove = useCallback((documentId) => run(
    `doc-${documentId}`,
    () => deleteExpedienteDocumentRequest(program, applicationId, documentId),
    'No se pudo eliminar el documento.',
  ), [run, program, applicationId]);

  const review = useCallback((documentId, reviewStatus, reviewComment = null) => run(
    `doc-${documentId}`,
    () => reviewExpedienteDocumentRequest(program, applicationId, documentId, {
      review_status: reviewStatus, review_comment: reviewComment,
    }),
    'No se pudo guardar la revisión.',
  ), [run, program, applicationId]);

  const clearActionError = useCallback(() => setActionError(null), []);

  return {
    requirements, documents, loading, error, reload: load,
    upload, remove, review, busyKey, actionError, setActionError, clearActionError,
  };
}

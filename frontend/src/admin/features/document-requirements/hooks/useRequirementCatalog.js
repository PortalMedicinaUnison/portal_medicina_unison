import { useCallback, useEffect, useState } from 'react';
import {
  createDocumentRequirementRequest,
  deleteDocumentRequirementRequest,
  deleteRequirementTemplateRequest,
  getDocumentRequirementsRequest,
  updateDocumentRequirementRequest,
  uploadRequirementTemplateRequest,
} from '../../../../services/documentService';
import { getErrorMessage } from '../../../../utils/errors';


// Catálogo de documentos de un programa con sus acciones; tras cada acción se recarga la lista.
export default function useRequirementCatalog(program) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data } = await getDocumentRequirementsRequest({ program });
      setRequirements(data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el catálogo de documentos.'));
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    setLoading(true);
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

  // requirement: null para crear uno nuevo.
  const save = useCallback((requirement, data) => run(
    requirement ? `req-${requirement.requirement_id}` : 'new',
    () => (requirement
      ? updateDocumentRequirementRequest(requirement.requirement_id, data)
      : createDocumentRequirementRequest({ ...data, program })),
    'No se pudo guardar el documento.',
  ), [run, program]);

  const retire = useCallback((id) => run(`req-${id}`, () => deleteDocumentRequirementRequest(id), 'No se pudo retirar el documento.'), [run]);
  const uploadTemplate = useCallback((id, file) => run(`tpl-${id}`, () => uploadRequirementTemplateRequest(id, file), 'No se pudo subir el formato.'), [run]);
  const removeTemplate = useCallback((id) => run(`tpl-${id}`, () => deleteRequirementTemplateRequest(id), 'No se pudo quitar el formato.'), [run]);

  return {
    requirements, loading, error, reload: load,
    save, retire, uploadTemplate, removeTemplate,
    busyKey, actionError, setActionError, clearActionError: () => setActionError(null),
  };
}

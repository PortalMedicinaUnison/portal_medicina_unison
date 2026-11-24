import { useCallback, useEffect, useRef, useState } from 'react';
import { getInscriptionsRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';

// Inscripciones de una promoción (con su internado o servicio social y el avance de documentos).
export default function useInscriptions(program, promotionId) {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(Boolean(promotionId));
  const [error, setError] = useState(null);
  const loadedFor = useRef(null);

  const load = useCallback(async () => {
    if (!promotionId) {
      setInscriptions([]);
      setLoading(false);
      return;
    }
    // Al refrescar la misma promoción no se vuelve a "cargando" (la tabla no parpadea).
    if (loadedFor.current !== promotionId) setLoading(true);
    setError(null);
    try {
      const { data } = await getInscriptionsRequest(program, { promotion_id: promotionId });
      setInscriptions(data);
      loadedFor.current = promotionId;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las inscripciones.'));
    } finally {
      setLoading(false);
    }
  }, [program, promotionId]);

  useEffect(() => {
    load();
  }, [load]);

  return { inscriptions, loading, error, reload: load };
}

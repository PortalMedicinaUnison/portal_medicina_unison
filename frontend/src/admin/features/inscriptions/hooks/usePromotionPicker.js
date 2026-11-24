import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllPromotionsRequest } from '../../../../services/promotionService';
import { getErrorMessage } from '../../../../utils/errors';

const byNewest = (a, b) => (b.year - a.year) || (b.period - a.period);

/**
 * Promociones del programa y la elegida, que viaja en la URL (?promotion_id=) para poder
 * compartir o recargar la vista. Por defecto, la más reciente sin finalizar.
 */
export default function usePromotionPicker(program) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllPromotionsRequest({ program })
      .then(({ data }) => { if (active) setPromotions([...data].sort(byNewest)); })
      .catch((err) => { if (active) setError(getErrorMessage(err, 'No se pudieron cargar las promociones.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [program]);

  const requested = Number(searchParams.get('promotion_id')) || null;
  const promotionId = useMemo(() => {
    if (requested && promotions.some((p) => p.promotion_id === requested)) return requested;
    const open = promotions.find((p) => !p.is_finished);
    return (open ?? promotions[0])?.promotion_id ?? null;
  }, [requested, promotions]);

  const promotion = promotions.find((p) => p.promotion_id === promotionId) ?? null;

  const selectPromotion = useCallback((id) => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('promotion_id', String(id));
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return { promotions, promotion, promotionId, selectPromotion, loading, error };
}

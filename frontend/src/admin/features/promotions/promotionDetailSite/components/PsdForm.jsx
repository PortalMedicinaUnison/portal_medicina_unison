import { useState, useCallback } from 'react';
import useCreatePsd from '../hooks/useCreatePsd';
import useGetSites from '../../../sites/hooks/useGetSites';
import { cleanFormData } from '../../../../../utils/utils';


const INITIAL_FORM = {
  siteId: '',
  capacity: '',
};

// Mismo límite que el backend (schemas/promotion.py: Capacity).
const MAX_CAPACITY = 1000;

function PsdForm({ promotionId, assignedSiteIds = [], onClose, onSuccess }) {
  const { createPsd, loading: saving, error: saveError, reset } = useCreatePsd();
  const { sites, loading: sitesFetching, error: sitesError } = useGetSites();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

  // Las sedes que ya tienen cupo en la promoción no se ofrecen (el backend respondería 409).
  const availableSites = sites.filter((site) => !assignedSiteIds.includes(site.site_id));

  // ---------------------- HANDLERS ----------------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationError) setValidationError('');
    if (saveError) reset();
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData({
      promotionId: Number(promotionId),
      siteId: Number(formData.siteId),
      capacity: Number(formData.capacity),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.promotionId) errors.push('No se recibió el ID de la promoción.');
    if (!cleanedData.siteId) errors.push('La sede es requerida.');
    if (!Number.isInteger(cleanedData.capacity) || cleanedData.capacity < 1 || cleanedData.capacity > MAX_CAPACITY) {
      errors.push(`El número de cupos debe ser un entero entre 1 y ${MAX_CAPACITY}.`);
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      promotion_id: cleanedData.promotionId,
      site_id: cleanedData.siteId,
      capacity: cleanedData.capacity,
    };

    // Se avisa al padre desde aquí (y no con un efecto) para que la lista se recargue
    // aunque el modal se haya cerrado mientras se guardaba.
    const response = await createPsd(payload);
    if (response) onSuccess?.(response.data);
  };

  // ---------------------- RENDER ----------------------

  const siteOptionLabel = sitesFetching
    ? 'Cargando sedes...'
    : availableSites.length === 0
      ? 'No hay sedes disponibles'
      : 'Seleccione una sede';

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {(validationError || saveError || sitesError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {validationError || saveError || sitesError}
          </span>
        </div>
      )}

      <dl className="item-list">
        <div className="item-row">
          <dt className="item-header">Sede</dt>
          <dd className="item-text">
            <select
              name="siteId"
              className="form-input w-full"
              value={formData.siteId}
              onChange={handleChange}
              disabled={sitesFetching || saving}
              required
            >
              <option value="">{siteOptionLabel}</option>
              {availableSites.map(site => (
                <option key={site.site_id} value={site.site_id}>
                  {site.name}
                </option>
              ))}
            </select>
          </dd>
        </div>

        <div className="item-row">
          <dt className="item-header">Número de cupos</dt>
          <dd className="item-text">
            <input
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className="form-input--half w-full"
              placeholder="1"
              min={1}
              max={MAX_CAPACITY}
              step={1}
              required
              disabled={saving}
            />
          </dd>
        </div>
      </dl>

      <div className="button-group">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default PsdForm;

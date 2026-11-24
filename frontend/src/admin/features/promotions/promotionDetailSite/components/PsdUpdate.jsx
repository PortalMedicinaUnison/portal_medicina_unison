import { useState, useCallback } from 'react';
import useUpdatePsd from '../hooks/useUpdatePsd';


// Mismo límite que el backend (schemas/promotion.py: Capacity).
const MAX_CAPACITY = 1000;

function PsdUpdate({ psd, onClose, onSuccess }) {
  const { updatePsd, loading: saving, error: saveError, reset } = useUpdatePsd();

  const [capacity, setCapacity] = useState(psd?.capacity ?? '');
  const [validationError, setValidationError] = useState('');

  const occupied = psd?.occupied ?? 0;
  const minCapacity = Math.max(1, occupied);

  // ---------------------- HANDLERS ----------------------
  const handleChange = useCallback((e) => {
    setCapacity(e.target.value);

    if (validationError) setValidationError('');
    if (saveError) reset();
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!psd?.psd_id) {
      setValidationError('No se recibió el cupo a editar.');
      return;
    }

    const value = Number(capacity);

    // ---------------------- VALIDATIONS ----------------------
    if (!Number.isInteger(value) || value < 1 || value > MAX_CAPACITY) {
      setValidationError(`El número de cupos debe ser un entero entre 1 y ${MAX_CAPACITY}.`);
      return;
    }
    if (value < occupied) {
      setValidationError(`La capacidad no puede ser menor que los internos ya asignados (${occupied}).`);
      return;
    }

    // Si el backend rechaza el cambio (p. ej. 409 porque ya hay más internos asignados),
    // su mensaje se muestra en `saveError`.
    const response = await updatePsd(psd.psd_id, { capacity: value });
    if (response) onSuccess?.(response.data);
  };

  // ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {validationError || saveError}
          </span>
        </div>
      )}

      <dl className="item-list">
        <div className="item-row">
          <dt className="item-header">Sede</dt>
          <dd className="item-text">{psd?.site?.name ?? '—'}</dd>
        </div>

        <div className="item-row">
          <dt className="item-header">Internos asignados</dt>
          <dd className="item-text">{occupied}</dd>
        </div>

        <div className="item-row">
          <dt className="item-header">Número de cupos</dt>
          <dd className="item-text">
            <input
              name="capacity"
              type="number"
              value={capacity}
              onChange={handleChange}
              className="form-input--half w-full"
              min={minCapacity}
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

export default PsdUpdate;

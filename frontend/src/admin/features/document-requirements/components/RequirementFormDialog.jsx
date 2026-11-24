import { useState } from 'react';
import Modal from '../../../../utils/ui/Modal';
import {
  DOCUMENT_PROVIDERS, DOCUMENT_PROVIDER_LABELS, DOCUMENT_STAGE_LABELS_BY_PROGRAM, PROGRAM_LABELS, labelOf,
} from '../../../../utils/constants';

const toForm = (requirement, stage) => ({
  stage: String(requirement?.stage ?? stage ?? 1),
  name: requirement?.name ?? '',
  description: requirement?.description ?? '',
  isRequired: requirement?.is_required ?? true,
  providedBy: String(requirement?.provided_by ?? DOCUMENT_PROVIDERS.STUDENT),
  allowsMultiple: requirement?.allows_multiple ?? false,
  validityMonths: requirement?.validity_months != null ? String(requirement.validity_months) : '',
  sortOrder: String(requirement?.sort_order ?? 0),
});

/**
 * Alta o edición de un documento del catálogo. El programa no se cambia (viene de la pestaña).
 * Se monta de nuevo cada vez que se abre (key en el padre), así el formulario empieza limpio.
 */
function RequirementFormDialog({ open, program, requirement, defaultStage, onClose, onSave, saving, saveError }) {
  const [form, setForm] = useState(() => toForm(requirement, defaultStage));
  const [validationError, setValidationError] = useState('');
  const stageLabels = DOCUMENT_STAGE_LABELS_BY_PROGRAM[program] ?? {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const validity = form.validityMonths.trim();
    const errors = [];
    if (!name) errors.push('El nombre es obligatorio.');
    if (validity && !(Number.isInteger(Number(validity)) && Number(validity) >= 1 && Number(validity) <= 60)) {
      errors.push('La vigencia debe ser un número de meses entre 1 y 60.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' '));
      return;
    }
    await onSave({
      stage: Number(form.stage),
      name,
      description: form.description.trim() || null,
      is_required: form.isRequired,
      provided_by: Number(form.providedBy),
      allows_multiple: form.allowsMultiple,
      validity_months: validity ? Number(validity) : null,
      sort_order: Number(form.sortOrder) || 0,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={requirement ? 'Editar documento' : `Nuevo documento · ${labelOf(PROGRAM_LABELS, program)}`}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="form-label" htmlFor="req-stage">Etapa</label>
          <select id="req-stage" name="stage" className="form-input_full" value={form.stage} onChange={handleChange} disabled={saving}>
            {Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="req-provider">Quién lo sube</label>
          <select id="req-provider" name="providedBy" className="form-input_full" value={form.providedBy} onChange={handleChange} disabled={saving}>
            {Object.entries(DOCUMENT_PROVIDER_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Los del alumno los revisa la coordinación. Los de la coordinación (p. ej. la constancia que emite la sede) quedan aprobados al subirlos.
          </p>
        </div>
        <div>
          <label className="form-label" htmlFor="req-name">Nombre</label>
          <input id="req-name" name="name" className="form-input_full" maxLength={150} value={form.name} onChange={handleChange} disabled={saving} />
        </div>
        <div>
          <label className="form-label" htmlFor="req-description">Indicaciones para el alumno (opcional)</label>
          <textarea id="req-description" name="description" className="form-input_full min-h-20" maxLength={2000} value={form.description} onChange={handleChange} disabled={saving} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="req-validity">Antigüedad máxima en meses (opcional)</label>
            <input id="req-validity" name="validityMonths" type="number" min="1" max="60" className="form-input_full" value={form.validityMonths} onChange={handleChange} disabled={saving} />
          </div>
          <div>
            <label className="form-label" htmlFor="req-order">Orden en la lista</label>
            <input id="req-order" name="sortOrder" type="number" min="0" className="form-input_full" value={form.sortOrder} onChange={handleChange} disabled={saving} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input type="checkbox" name="isRequired" checked={form.isRequired} onChange={handleChange} disabled={saving} />
          Obligatorio (sin él no se registra la plaza o no se finaliza el programa)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input type="checkbox" name="allowsMultiple" checked={form.allowsMultiple} onChange={handleChange} disabled={saving} />
          Permite varios archivos (p. ej. bitácoras o reportes)
        </label>

        {(validationError || saveError) && <div className="alert-error">{validationError || saveError}</div>}

        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default RequirementFormDialog;

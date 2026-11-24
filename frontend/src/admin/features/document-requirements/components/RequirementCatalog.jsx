import { useRef, useState } from 'react';
import { getRequirementTemplateRequest } from '../../../../services/documentService';
import {
  DOCUMENT_PROVIDERS, DOCUMENT_STAGES, DOCUMENT_STAGE_LABELS_BY_PROGRAM, PROGRAMS, PROGRAM_LABELS,
} from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import useFileLinks from '../../../../features/expediente/hooks/useFileLinks';
import { TEMPLATE_ACCEPT, getTemplateError } from '../../../../features/expediente/fileRules';
import useRequirementCatalog from '../hooks/useRequirementCatalog';
import RequirementFormDialog from './RequirementFormDialog';

const STAGES = [DOCUMENT_STAGES.INSCRIPTION, DOCUMENT_STAGES.IN_PROGRESS, DOCUMENT_STAGES.COMPLETION];


function TemplateControls({ requirement, busy, onUpload, onRemove, onDownload }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onUpload(requirement, file);
  };
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="text-gray-600">
        Formato: {requirement.has_template ? <strong className="font-medium text-gray-800">{requirement.template_filename}</strong> : 'sin formato'}
      </span>
      {requirement.has_template && (
        <button type="button" className="btn-tertiary text-xs" onClick={() => onDownload(requirement)}>Descargar</button>
      )}
      <input ref={inputRef} type="file" accept={TEMPLATE_ACCEPT} className="hidden" onChange={handleFile}
        aria-label={`Subir formato: ${requirement.name}`} />
      <button type="button" className="btn-tertiary text-xs" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? 'Guardando...' : (requirement.has_template ? 'Reemplazar' : 'Subir formato')}
      </button>
      {requirement.has_template && (
        <button type="button" className="btn-tertiary text-xs text-red-600" onClick={() => onRemove(requirement)} disabled={busy}>Quitar</button>
      )}
    </div>
  );
}

function RequirementCatalog() {
  const [program, setProgram] = useState(PROGRAMS.INTERNSHIP);
  const {
    requirements, loading, error, reload, save, retire, uploadTemplate, removeTemplate,
    busyKey, actionError, setActionError, clearActionError,
  } = useRequirementCatalog(program);
  const links = useFileLinks();
  // null: cerrado; { requirement, stage }: abierto (requirement null = nuevo)
  const [editing, setEditing] = useState(null);
  const [editKey, setEditKey] = useState(0);
  const [toRetire, setToRetire] = useState(null);

  const stageLabels = DOCUMENT_STAGE_LABELS_BY_PROGRAM[program] ?? {};

  const openForm = (requirement, stage) => {
    clearActionError();
    setEditKey((k) => k + 1);
    setEditing({ requirement, stage });
  };

  const handleSave = async (data) => {
    if (await save(editing.requirement, data)) setEditing(null);
  };

  const handleUploadTemplate = async (requirement, file) => {
    const fileError = getTemplateError(file);
    if (fileError) {
      setActionError(fileError);
      return;
    }
    await uploadTemplate(requirement.requirement_id, file);
  };

  const handleDownloadTemplate = (requirement) => links.openDownload(
    () => getRequirementTemplateRequest(requirement.requirement_id),
    requirement.template_filename || `formato_${requirement.requirement_id}`,
  );

  const handleConfirmRetire = async () => {
    const requirement = toRetire;
    setToRetire(null);
    await retire(requirement.requirement_id);
  };

  const shownError = (!editing && actionError) || links.error;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-md ring-1 ring-gray-300" role="tablist" aria-label="Programa">
          {[PROGRAMS.INTERNSHIP, PROGRAMS.SOCIAL_SERVICE].map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={program === value}
              className={`px-4 py-1.5 text-sm first:rounded-l-md last:rounded-r-md ${program === value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              onClick={() => { clearActionError(); setProgram(value); }}
            >
              {PROGRAM_LABELS[value]}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={() => openForm(null, DOCUMENT_STAGES.INSCRIPTION)}>
          Agregar documento
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Lo que se pide a los alumnos en cada etapa. Los obligatorios de inscripción deben estar aprobados para
        registrar la plaza, y los de las etapas siguientes para finalizar el internado o liberar el servicio social.
      </p>

      {shownError && (
        <div className="alert-error flex items-start justify-between gap-4" role="alert">
          <span>{shownError}</span>
          <button type="button" className="text-xs underline" onClick={() => { clearActionError(); links.clearError(); }}>Cerrar</button>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {!loading && error && <DataLoadError title="No se pudo cargar el catálogo" message={error} onRetry={reload} />}

      {!loading && !error && STAGES.map((stage) => {
        const items = requirements.filter((r) => Number(r.stage) === stage);
        return (
          <section key={stage} className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{stageLabels[stage]}</h3>
              <button type="button" className="btn-tertiary text-sm" onClick={() => openForm(null, stage)}>Agregar aquí</button>
            </div>
            {items.length === 0 && <p className="text-sm italic text-gray-500">No se pide ningún documento en esta etapa.</p>}
            <ul className="space-y-3">
              {items.map((requirement) => (
                <li key={requirement.requirement_id} className="rounded-lg border border-gray-200 p-4 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium text-gray-900">
                        {requirement.name}
                        <span className={`ml-2 text-xs font-normal ${requirement.is_required ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {requirement.is_required ? 'Obligatorio' : 'Opcional'}
                        </span>
                        {Number(requirement.provided_by) === DOCUMENT_PROVIDERS.COORDINATION && (
                          <span className="ml-2 text-xs font-normal text-amber-700">Lo sube la coordinación</span>
                        )}
                        {requirement.allows_multiple && <span className="ml-2 text-xs font-normal text-gray-500">Varios archivos</span>}
                        {requirement.validity_months && (
                          <span className="ml-2 text-xs font-normal text-gray-500">Máx. {requirement.validity_months} {requirement.validity_months === 1 ? 'mes' : 'meses'}</span>
                        )}
                      </p>
                      {requirement.description && <p className="text-xs text-gray-600">{requirement.description}</p>}
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button type="button" className="btn-tertiary text-sm" onClick={() => openForm(requirement, stage)}>Editar</button>
                      <button type="button" className="btn-tertiary text-sm text-red-600" onClick={() => setToRetire(requirement)}
                        disabled={busyKey === `req-${requirement.requirement_id}`}>
                        Retirar
                      </button>
                    </div>
                  </div>
                  <TemplateControls
                    requirement={requirement}
                    busy={busyKey === `tpl-${requirement.requirement_id}`}
                    onUpload={handleUploadTemplate}
                    onRemove={(r) => removeTemplate(r.requirement_id)}
                    onDownload={handleDownloadTemplate}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {editing && (
        <RequirementFormDialog
          key={editKey}
          open
          program={program}
          requirement={editing.requirement}
          defaultStage={editing.stage}
          onClose={() => { clearActionError(); setEditing(null); }}
          onSave={handleSave}
          saving={busyKey === (editing.requirement ? `req-${editing.requirement.requirement_id}` : 'new')}
          saveError={actionError}
        />
      )}

      <Modal open={Boolean(toRetire)} onClose={() => setToRetire(null)}>
        <ConfirmDialogContent
          title="Retirar documento"
          message={`"${toRetire?.name}" ya no se pedirá a los alumnos. Los archivos que ya subieron se conservan en sus documentos.`}
          onConfirm={handleConfirmRetire}
          onCancel={() => setToRetire(null)}
          primaryLabel="Retirar"
          secondaryLabel="Cancelar"
          danger
        />
      </Modal>
    </div>
  );
}

export default RequirementCatalog;

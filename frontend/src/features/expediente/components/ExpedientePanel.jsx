import { useState } from 'react';
import {
  getExpedienteDocumentFileRequest,
  getRequirementTemplateRequest,
} from '../../../services/documentService';
import {
  DOCUMENT_PROVIDERS, DOCUMENT_STAGES, DOCUMENT_STAGE_LABELS_BY_PROGRAM, REVIEW_STATUS,
} from '../../../utils/constants';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../utils/ui/DataLoadError';
import Modal from '../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../utils/ui/ConfirmDialogContent';
import useExpediente from '../hooks/useExpediente';
import useFileLinks from '../hooks/useFileLinks';
import { getPdfError, pdfDownloadName } from '../fileRules';
import RequirementCard from './RequirementCard';
import ObservationsDialog from './ObservationsDialog';

const ALL_STAGES = [DOCUMENT_STAGES.INSCRIPTION, DOCUMENT_STAGES.IN_PROGRESS, DOCUMENT_STAGES.COMPLETION];

const isApproved = (doc) => Number(doc.review_status) === REVIEW_STATUS.APPROVED;

// [[docs del requisito A], [docs del requisito B], ...] conservando el orden de llegada.
const groupByRequirement = (docs) => Object.values(docs.reduce((groups, doc) => {
  (groups[doc.requirement_id] ??= []).push(doc);
  return groups;
}, {}));

/**
 * Expediente de una asignación (internado o servicio social), agrupado por etapa.
 *
 * Props:
 * - program: 1 internado | 2 servicio social
 * - applicationId
 * - mode: 'student' | 'admin' (la coordinación revisa los del alumno y sube solo los que emite ella)
 * - stages: etapas a mostrar (por defecto todas)
 * - started: ya aceptó la asignación; habilita las etapas "durante" y "término"
 * - closed: expediente cerrado (programa terminado o promoción finalizada): solo consulta, también
 *   para la coordinación (una corrección ya no tendría salida; primero se cambia el estatus)
 * - onChange: se llama después de subir, eliminar o revisar (p. ej. para refrescar el avance)
 */
function ExpedientePanel({ program, applicationId, mode = 'student', stages = ALL_STAGES, started = false, closed = false, onChange }) {
  const isAdmin = mode === 'admin';
  const {
    requirements, documents, loading, error, reload,
    upload, remove, review, busyKey, actionError, setActionError, clearActionError,
  } = useExpediente(program, applicationId);
  const links = useFileLinks();
  const [toDelete, setToDelete] = useState(null);
  const [toObserve, setToObserve] = useState(null);
  // Etapas abiertas o colapsadas a mano (stage → bool); al alumno se le colapsan las ya completas.
  const [openStages, setOpenStages] = useState({});

  if (loading) return <LoadingSpinner />;
  if (error) {
    return <DataLoadError title="No se pudieron cargar los documentos" message={error} onRetry={reload} />;
  }

  const stageLabels = DOCUMENT_STAGE_LABELS_BY_PROGRAM[program] ?? {};
  const activeIds = new Set(requirements.map((r) => r.requirement_id));
  const docsFor = (requirementId) => documents.filter((doc) => doc.requirement_id === requirementId);
  const retiredDocs = documents.filter((doc) => !activeIds.has(doc.requirement_id));
  const stageOpen = (stage) => stage === DOCUMENT_STAGES.INSCRIPTION || started;
  const isCoordinationDoc = (requirement) => Number(requirement.provided_by) === DOCUMENT_PROVIDERS.COORDINATION;
  // El alumno sube los suyos (etapa abierta y expediente sin cerrar); la coordinación, solo los que emite ella.
  const canUpload = (requirement) => (isAdmin
    ? isCoordinationDoc(requirement) && !closed && stageOpen(Number(requirement.stage))
    : !isCoordinationDoc(requirement) && !closed && stageOpen(Number(requirement.stage)));

// ---------------------- HANDLERS ----------------------

  const after = (ok) => { if (ok) onChange?.(); };

  const handleUpload = async (requirement, file) => {
    links.clearError();
    const fileError = getPdfError(file);
    if (fileError) {
      setActionError(fileError);
      return;
    }
    after(await upload(requirement.requirement_id, file));
  };

  const fileActions = {
    onView: (doc) => links.openView(() => getExpedienteDocumentFileRequest(program, applicationId, doc.document_id)),
    onDownload: (doc) => links.openDownload(
      () => getExpedienteDocumentFileRequest(program, applicationId, doc.document_id, { download: true }),
      pdfDownloadName(doc),
    ),
    onDelete: (doc) => setToDelete(doc),
    onApprove: async (doc) => after(await review(doc.document_id, REVIEW_STATUS.APPROVED)),
    onObserve: (doc) => setToObserve(doc),
    onBackToReview: async (doc) => after(await review(doc.document_id, REVIEW_STATUS.PENDING)),
  };

  const handleDownloadTemplate = (requirement) => links.openDownload(
    () => getRequirementTemplateRequest(requirement.requirement_id),
    requirement.template_filename || `formato_${requirement.requirement_id}`,
  );

  const handleConfirmDelete = async () => {
    const doc = toDelete;
    setToDelete(null);
    after(await remove(doc.document_id));
  };

  const handleObservations = async (comment) => {
    const doc = toObserve;
    const ok = await review(doc.document_id, REVIEW_STATUS.REJECTED, comment);
    if (ok) setToObserve(null);
    after(ok);
    return ok;
  };

  const shownError = actionError || links.error;

// ---------------------- RENDER ----------------------

  return (
    <div className="space-y-8">
      {isAdmin && closed && (
        <p className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          Expediente cerrado: solo consulta. Para revisar o cambiar documentos, primero regresa el estatus a &quot;En curso&quot;
          (o reabre la promoción si ya está finalizada).
        </p>
      )}
      {shownError && (
        <div className="alert-error flex items-start justify-between gap-4" role="alert">
          <span>{shownError}</span>
          <button type="button" className="text-xs underline" onClick={() => { clearActionError(); links.clearError(); }}>
            Cerrar
          </button>
        </div>
      )}

      {stages.map((stage) => {
        const stageRequirements = requirements.filter((r) => Number(r.stage) === stage);
        if (stageRequirements.length === 0) return null;
        const required = stageRequirements.filter((r) => r.is_required);
        const done = required.filter((r) => docsFor(r.requirement_id).some(isApproved)).length;
        // Para el alumno cuenta también lo que ya subió (en revisión): es lo que necesita para avanzar.
        const sent = required.filter((r) => docsFor(r.requirement_id).some((d) => Number(d.review_status) !== REVIEW_STATUS.REJECTED)).length;
        const waitingForAcceptance = !isAdmin && !closed && !stageOpen(stage)
          && stageRequirements.some((r) => !isCoordinationDoc(r));
        const collapsible = !isAdmin && required.length > 0 && done === required.length;
        const isOpen = openStages[stage] ?? !collapsible;
        return (
          <section key={stage} className="space-y-3" aria-labelledby={`stage-${applicationId}-${stage}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 id={`stage-${applicationId}-${stage}`} className="text-base font-semibold text-gray-900">
                {stageLabels[stage]}
                {collapsible && (
                  <button type="button" className="ml-3 py-1 text-xs font-normal text-indigo-700 underline" aria-expanded={isOpen}
                    onClick={() => setOpenStages((prev) => ({ ...prev, [stage]: !isOpen }))}>
                    {isOpen ? 'Ocultar documentos' : 'Ver documentos'}
                  </button>
                )}
              </h4>
              {required.length > 0 && (
                <span className={`text-xs ${done === required.length ? 'text-green-700' : 'text-gray-600'}`}>
                  {isAdmin || sent === done
                    ? `${done} de ${required.length} ${required.length === 1 ? 'obligatorio aprobado' : 'obligatorios aprobados'}`
                    : `${sent} de ${required.length} ${required.length === 1 ? 'obligatorio subido' : 'obligatorios subidos'} · ${done} ${done === 1 ? 'aprobado' : 'aprobados'}`}
                </span>
              )}
            </div>
            {waitingForAcceptance && (
              <p className="text-xs text-gray-500">Podrás subir estos documentos cuando aceptes tu asignación.</p>
            )}
            <div className={isOpen ? 'space-y-3' : 'hidden'}>
              {stageRequirements.map((requirement) => (
                <RequirementCard
                  key={requirement.requirement_id}
                  requirement={requirement}
                  documents={docsFor(requirement.requirement_id)}
                  isAdmin={isAdmin}
                  canUpload={canUpload(requirement)}
                  reviewLocked={closed}
                  busyKey={busyKey}
                  onUpload={handleUpload}
                  onDownloadTemplate={handleDownloadTemplate}
                  {...fileActions}
                />
              ))}
            </div>
          </section>
        );
      })}

      {retiredDocs.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-base font-semibold text-gray-900">Documentos que ya no se solicitan</h4>
          <div className="space-y-3">
            {groupByRequirement(retiredDocs).map((docs) => (
              <RequirementCard
                key={docs[0].requirement_id}
                requirement={{ ...docs[0].requirement, has_template: false }}
                documents={docs}
                isAdmin={isAdmin}
                canUpload={false}
                busyKey={busyKey}
                onUpload={handleUpload}
                onDownloadTemplate={handleDownloadTemplate}
                {...fileActions}
              />
            ))}
          </div>
        </section>
      )}

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <ConfirmDialogContent
          title="Eliminar documento"
          message={`¿Eliminar "${toDelete?.original_filename || 'este documento'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          danger
        />
      </Modal>

      <ObservationsDialog
        open={Boolean(toObserve)}
        documentName={toObserve?.original_filename}
        onClose={() => setToObserve(null)}
        onSubmit={handleObservations}
        saving={toObserve ? busyKey === `doc-${toObserve.document_id}` : false}
      />
    </div>
  );
}

export default ExpedientePanel;

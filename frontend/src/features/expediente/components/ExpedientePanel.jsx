import { useState } from 'react';
import {
  getExpedienteDocumentFileRequest,
  getRequirementTemplateRequest,
} from '../../../services/documentService';
import {
  DOCUMENT_STAGES, DOCUMENT_STAGE_LABELS_BY_PROGRAM, REVIEW_STATUS,
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
 * - mode: 'student' | 'admin' (la coordinación revisa, sube por el alumno y elimina)
 * - stages: etapas a mostrar (por defecto todas)
 * - started: (alumno) ya aceptó; habilita las etapas "durante" y "término"
 * - closed: (alumno) expediente cerrado: solo consulta
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

  if (loading) return <LoadingSpinner />;
  if (error) {
    return <DataLoadError title="No se pudieron cargar los documentos" message={error} onRetry={reload} />;
  }

  const stageLabels = DOCUMENT_STAGE_LABELS_BY_PROGRAM[program] ?? {};
  const activeIds = new Set(requirements.map((r) => r.requirement_id));
  const docsFor = (requirementId) => documents.filter((doc) => doc.requirement_id === requirementId);
  const retiredDocs = documents.filter((doc) => !activeIds.has(doc.requirement_id));
  const canUploadStage = (stage) => isAdmin || (!closed && (stage === DOCUMENT_STAGES.INSCRIPTION || started));

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
        const open = canUploadStage(stage);
        return (
          <section key={stage} className="space-y-3" aria-labelledby={`stage-${applicationId}-${stage}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 id={`stage-${applicationId}-${stage}`} className="text-base font-semibold text-gray-900">
                {stageLabels[stage]}
              </h4>
              {required.length > 0 && (
                <span className={`text-xs ${done === required.length ? 'text-green-700' : 'text-gray-600'}`}>
                  {done} de {required.length} obligatorios aprobados
                </span>
              )}
            </div>
            {!isAdmin && !open && !closed && (
              <p className="text-xs text-gray-500">Podrás subir estos documentos cuando aceptes tu asignación.</p>
            )}
            <div className="space-y-3">
              {stageRequirements.map((requirement) => (
                <RequirementCard
                  key={requirement.requirement_id}
                  requirement={requirement}
                  documents={docsFor(requirement.requirement_id)}
                  isAdmin={isAdmin}
                  canUpload={open}
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

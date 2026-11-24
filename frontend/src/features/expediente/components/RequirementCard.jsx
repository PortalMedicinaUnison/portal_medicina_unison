import { useRef } from 'react';
import { DOCUMENT_PROVIDERS, REVIEW_STATUS } from '../../../utils/constants';
import { formatDateTime } from '../../../utils/utils';
import ReviewStatusBadge from './ReviewStatusBadge';


function FileRow({ doc, busy, canDelete, canReview, onView, onDownload, onDelete, onApprove, onObserve, onBackToReview }) {
  const status = Number(doc.review_status);
  return (
    <li className="flex flex-col gap-2 rounded-md bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-900" title={doc.original_filename || undefined}>
          {doc.original_filename || `Documento ${doc.document_id}`}
        </p>
        <p className="text-xs text-gray-500">
          {formatDateTime(doc.created_at)}
          {doc.uploaded_by_coordination && ' · Subido por la coordinación'}
        </p>
        {status === REVIEW_STATUS.REJECTED && doc.review_comment && (
          <p className="mt-1 whitespace-pre-line text-xs text-red-700">
            <strong>Observaciones:</strong> {doc.review_comment}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <ReviewStatusBadge status={status} />
        <button type="button" className="btn-tertiary py-1.5 text-xs" onClick={() => onView(doc)}>Ver</button>
        <button type="button" className="btn-tertiary py-1.5 text-xs" onClick={() => onDownload(doc)}>Descargar</button>
        {canReview && status !== REVIEW_STATUS.APPROVED && (
          <button type="button" className="btn-tertiary py-1.5 text-xs text-green-700" onClick={() => onApprove(doc)} disabled={busy}>
            Aprobar
          </button>
        )}
        {canReview && status !== REVIEW_STATUS.REJECTED && (
          <button type="button" className="btn-tertiary py-1.5 text-xs text-red-700" onClick={() => onObserve(doc)} disabled={busy}>
            Pedir corrección
          </button>
        )}
        {canReview && status !== REVIEW_STATUS.PENDING && (
          <button type="button" className="btn-tertiary py-1.5 text-xs" onClick={() => onBackToReview(doc)} disabled={busy}>
            Deshacer revisión
          </button>
        )}
        {canDelete && (
          <button type="button" className="btn-tertiary py-1.5 text-xs text-red-600" onClick={() => onDelete(doc)} disabled={busy}>
            Eliminar
          </button>
        )}
      </div>
    </li>
  );
}

/**
 * Un documento del catálogo con sus archivos. `canUpload` dice si quien mira puede subirlo ahora
 * (el alumno los suyos con la etapa abierta; la coordinación, solo los que emite ella). Las reglas
 * también las aplica el backend.
 */
function RequirementCard({
  requirement, documents, isAdmin, canUpload, busyKey, reviewLocked = false,
  onUpload, onDownloadTemplate, ...fileActions
}) {
  const inputRef = useRef(null);
  const byCoordination = Number(requirement.provided_by) === DOCUMENT_PROVIDERS.COORDINATION;
  const approved = documents.some((doc) => Number(doc.review_status) === REVIEW_STATUS.APPROVED);
  const uploading = busyKey === `req-${requirement.requirement_id}`;
  const lockedForStudent = !isAdmin && !requirement.allows_multiple && approved;
  const showUpload = canUpload && !lockedForStudent;
  const uploadLabel = requirement.allows_multiple
    ? 'Agregar archivo'
    : (documents.length > 0 ? 'Reemplazar' : 'Subir PDF');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (file) onUpload(requirement, file);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-gray-900">
            {requirement.name}{' '}
            <span className={`ml-1 align-middle text-xs font-normal ${requirement.is_required ? 'text-indigo-700' : 'text-gray-500'}`}>
              {requirement.is_required ? 'Obligatorio' : 'Opcional'}
            </span>
          </p>
          {requirement.description && <p className="text-xs text-gray-600">{requirement.description}</p>}
          {byCoordination && (
            <p className="text-xs text-gray-500">Lo sube la coordinación.</p>
          )}
          {(requirement.validity_months || requirement.allows_multiple) && (
            <p className="text-xs text-gray-500">
              {requirement.validity_months && `Antigüedad máxima: ${requirement.validity_months} ${requirement.validity_months === 1 ? 'mes' : 'meses'}. `}
              {requirement.allows_multiple && 'Puedes subir varios archivos.'}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {requirement.has_template && (
            <button type="button" className="btn-secondary text-xs" onClick={() => onDownloadTemplate(requirement)}>
              Descargar formato
            </button>
          )}
          {showUpload && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFile}
                aria-label={`${uploadLabel}: ${requirement.name}`}
              />
              <button
                type="button"
                className="btn-primary text-xs"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : uploadLabel}
              </button>
            </>
          )}
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="text-xs italic text-gray-500">
          {byCoordination && !isAdmin ? 'La coordinación aún no lo sube.' : 'Aún no hay archivo.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <FileRow
              key={doc.document_id}
              doc={doc}
              busy={busyKey === `doc-${doc.document_id}`}
              canReview={isAdmin && !byCoordination && !reviewLocked}
              canDelete={isAdmin
                ? byCoordination && !reviewLocked
                : (canUpload && Number(doc.review_status) !== REVIEW_STATUS.APPROVED)}
              {...fileActions}
            />
          ))}
        </ul>
      )}
      {lockedForStudent && canUpload && (
        <p className="text-xs text-gray-500">Aprobado. Si necesitas cambiarlo, pide a la coordinación que deshaga la revisión.</p>
      )}
    </div>
  );
}

export default RequirementCard;

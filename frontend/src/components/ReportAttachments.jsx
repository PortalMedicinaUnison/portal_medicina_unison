import { useEffect, useRef, useState } from 'react';
import {
  addReportAttachmentRequest, deleteReportAttachmentRequest, getReportAttachmentFileRequest,
} from '../services/reportService';
import { getErrorMessage } from '../utils/errors';
import { formatDateTime } from '../utils/utils';
import useFileLinks from '../features/expediente/hooks/useFileLinks';
import Modal from '../utils/ui/Modal';
import ConfirmDialogContent from '../utils/ui/ConfirmDialogContent';
import { EVIDENCE_ACCEPT, MAX_EVIDENCE_FILES, formatFileSize, getEvidenceError } from '../features/expediente/fileRules';

const kindOf = (attachment) => (attachment.media_type === 'application/pdf' ? 'PDF' : 'Imagen');

/**
 * Evidencias de un reporte (PDF o imágenes). Todos ven y descargan; el estudiante dueño agrega y
 * quita archivos mientras el reporte siga abierto (`canEdit`). `onChange` recibe el reporte actualizado.
 */
function ReportAttachments({ report, canEdit = false, onChange }) {
  const inputRef = useRef(null);
  const links = useFileLinks();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState(report.attachments ?? []);
  const [toRemove, setToRemove] = useState(null);   // se confirma antes de quitar
  useEffect(() => { setAttachments(report.attachments ?? []); }, [report.attachments]);
  const canAdd = canEdit && attachments.length < MAX_EVIDENCE_FILES;

  const handleFiles = async (event) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (files.length === 0) return;
    if (attachments.length + files.length > MAX_EVIDENCE_FILES) {
      setError(`Cada reporte admite hasta ${MAX_EVIDENCE_FILES} archivos; puedes agregar ${MAX_EVIDENCE_FILES - attachments.length} más.`);
      return;
    }
    const problem = files.map(getEvidenceError).find(Boolean);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    let latest = null;
    try {
      for (const file of files) {
        const { data } = await addReportAttachmentRequest(report.report_id, file);
        latest = data;
      }
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo adjuntar el archivo.'));
    } finally {
      setBusy(false);
      if (latest) {
        setAttachments(latest.attachments);
        onChange?.(latest);
      }
    }
  };

  const handleRemove = async () => {
    const attachment = toRemove;
    setToRemove(null);
    setBusy(true);
    setError(null);
    try {
      const { data } = await deleteReportAttachmentRequest(report.report_id, attachment.attachment_id);
      setAttachments(data.attachments);
      onChange?.(data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo quitar el archivo.'));
    } finally {
      setBusy(false);
    }
  };

  const shownError = error || links.error;

  return (
    <div className="flex flex-col gap-3">
      {attachments.length === 0 && <p className="text-sm italic text-gray-500">Sin archivos de evidencia.</p>}
      {attachments.length > 0 && (
        <ul className="divide-y rounded-md border border-gray-200">
          {attachments.map((attachment) => (
            <li key={attachment.attachment_id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium text-gray-900">{attachment.original_filename}</span>
                <span className="block text-xs text-gray-500">
                  {kindOf(attachment)} · {formatFileSize(attachment.size)} · {formatDateTime(attachment.created_at)}
                </span>
              </span>
              <span className="flex flex-wrap gap-3">
                <button type="button" className="btn-tertiary py-1.5 text-xs"
                  onClick={() => links.openView(() => getReportAttachmentFileRequest(report.report_id, attachment.attachment_id))}>
                  Ver
                </button>
                <button type="button" className="btn-tertiary py-1.5 text-xs"
                  onClick={() => links.openDownload(
                    () => getReportAttachmentFileRequest(report.report_id, attachment.attachment_id, { download: true }),
                    attachment.original_filename,
                  )}>
                  Descargar
                </button>
                {canEdit && (
                  <button type="button" className="btn-tertiary py-1.5 text-xs text-red-600" onClick={() => setToRemove(attachment)} disabled={busy}>
                    Quitar
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {shownError && <div className="alert-error">{shownError}</div>}
      <Modal open={Boolean(toRemove)} onClose={() => setToRemove(null)}>
        <ConfirmDialogContent
          title="Quitar evidencia"
          message={`¿Quitar "${toRemove?.original_filename}" del reporte? No se puede deshacer.`}
          onConfirm={handleRemove}
          onCancel={() => setToRemove(null)}
          primaryLabel="Quitar"
          secondaryLabel="Cancelar"
          danger
        />
      </Modal>
      {canAdd && (
        <div className="flex flex-wrap items-center gap-3">
          <input ref={inputRef} type="file" multiple accept={EVIDENCE_ACCEPT} className="hidden" onChange={handleFiles}
            aria-label="Adjuntar archivos de evidencia" />
          <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Adjuntando...' : 'Adjuntar archivos'}
          </button>
          <span className="text-xs text-gray-500">PDF o imágenes JPG, PNG o WebP; hasta {MAX_EVIDENCE_FILES} archivos.</span>
        </div>
      )}
    </div>
  );
}

export default ReportAttachments;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteReport from '../hooks/useDeleteReport';
import useSetReportStatus from '../hooks/useSetReportStatus';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { REPORT_TYPES, REPORT_TYPE_LABELS, labelOf } from '../../../../utils/constants';
import { formatDate, formatDateTime } from '../../../../utils/utils';


const isHttpUrl = (value) => /^https?:\/\//i.test(String(value ?? ''));

function ReportDetail({ report, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteReport, loading: deleting, success: deleted, error: deleteError, reset: resetDelete } = useDeleteReport();
  const { setReportStatus, loading: updatingStatus, success: statusUpdated, error: statusError, reset: resetStatus } = useSetReportStatus();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleToggleStatus = () => {
    if (!report) return;
    setReportStatus(report.report_id, !report.is_open);
  };

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!report) return;
    await deleteReport(report.report_id);
  };

  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    resetDelete();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (statusUpdated) {
      refetch();
      resetStatus();
    }
  }, [statusUpdated, refetch, resetStatus]);

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      resetDelete();
      navigate(adminAbs(ROUTES.ADMIN.REPORT_LIST), { replace: true });
    }
  }, [deleted, navigate, resetDelete]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  // Al recargar después de cerrar/reabrir se mantienen los datos en pantalla.
  if (fetching && !report) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.REPORT_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

  if (!report) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para este reporte."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.REPORT_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

// ---------------------- RENDER ----------------------

  // Si el reporte es anónimo, el backend no envía los datos del alumno a la administración
  // y aquí tampoco se enlaza su internado (revelaría quién lo hizo).
  const { student } = report;
  const isAnonymous = report.anonymity || (!student && !report.academic_id);
  const typeLabel = labelOf(REPORT_TYPE_LABELS, report.report_type);

  return (
    <div className="info-container">
      {statusError && (
        <div className="alert-error" role="alert">
          {statusError}
        </div>
      )}

      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Alumno</dt>
            <dd className="item-text">
              {isAnonymous
                ? 'Anónimo'
                : student
                  ? <>{student.first_name} {student.last_name} {student.second_last_name}</>
                  : 'Sin datos del alumno'}
            </dd>
          </div>
          {!isAnonymous && (
            <>
              <div className="item-row">
                <dt className="item-header">Expediente</dt>
                <dd className="item-text">{report.academic_id ?? '—'}</dd>
              </div>
              <div className="item-row">
                <dt className="item-header">Correo</dt>
                <dd className="item-text">{student?.email ?? '—'}</dd>
              </div>
              {report.internship_id != null && (
                <div className="item-row">
                  <dt className="item-header">Internado</dt>
                  <dd className="item-text">
                    <Link to={adminAbs(ROUTES.ADMIN.INTERNSHIP_DETAIL(report.internship_id))}>
                      Ver internado
                    </Link>
                  </dd>
                </div>
              )}
            </>
          )}
          <div className="item-row">
            <dt className="item-header">Reporte anónimo</dt>
            <dd className="item-text">{report.anonymity ? 'Sí' : 'No'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">
              {report.site ? `${report.site.name} (${report.site.city})` : '—'}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Fecha del incidente</dt>
            <dd className="item-text">{formatDate(report.date_report)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Tipo</dt>
            <dd className="item-text">
              {report.report_type === REPORT_TYPES.OTHER && report.other_type
                ? `${typeLabel}: ${report.other_type}`
                : typeLabel}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Descripción</dt>
            <dd className="item-text whitespace-pre-line break-words">{report.description}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Evidencia</dt>
            <dd className="item-text break-all">
              {!report.evidence_url
                ? 'Sin evidencia'
                : isHttpUrl(report.evidence_url)
                  ? (
                    <a href={report.evidence_url} target="_blank" rel="noopener noreferrer">
                      {report.evidence_url}
                    </a>
                  )
                  : report.evidence_url}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{report.is_open ? 'Abierto' : 'Cerrado'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Fecha de registro</dt>
            <dd className="item-text">{formatDateTime(report.created_at)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Última actualización</dt>
            <dd className="item-text">{formatDateTime(report.updated_at)}</dd>
          </div>
        </dl>
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar el reporte?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message={deleteError || 'Ocurrió un problema al eliminar el reporte.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
        <button
          type="button"
          className='btn-tertiary'
          onClick={handleToggleStatus}
          disabled={updatingStatus || fetching}
        >
          {updatingStatus
            ? 'Guardando...'
            : report.is_open ? 'Cerrar reporte' : 'Reabrir reporte'}
        </button>
        <button
          type="button"
          className='btn-tertiary'
          onClick={handleDeleteButton}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}

export default ReportDetail;

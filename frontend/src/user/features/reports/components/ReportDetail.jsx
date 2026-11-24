import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import useDeleteReport from '../hooks/useDeleteReport';
import { REPORT_TYPES, REPORT_TYPE_LABELS, labelOf } from '../../../../utils/constants';
import { formatDate, formatDateTime } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { isHttpUrl } from '../../../../utils/validations';



function ReportDetail({ report, fetching, fetchError, refetch, reportId }) {
  const navigate = useNavigate();
  const { deleteReport, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteReport();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleEditButton = () => navigate(ROUTES.USER.REPORT_EDIT(reportId));
  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!reportId) return;
    await deleteReport(reportId);
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
    // Si la coordinación cerró el reporte mientras tanto (409), se refleja su nuevo estado.
    refetch?.();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      navigate(ROUTES.USER.REPORTS_LIST, { replace: true });
    }
  }, [deleted, navigate, reset]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(ROUTES.USER.REPORTS_LIST)}
        secondaryLabel="Ir a mis reportes"
      />
    );
  }

  if (!report) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información de este reporte."
        onRetry={refetch}
        retryLabel="Recargar"
        onSecondary={() => navigate(ROUTES.USER.REPORTS_LIST)}
        secondaryLabel="Ir a mis reportes"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const isOther = Number(report.report_type) === REPORT_TYPES.OTHER;
  const typeLabel = labelOf(REPORT_TYPE_LABELS, report.report_type);

  return (
    <div className="info-container">
      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{report.is_open ? 'Abierto' : 'Cerrado'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Fecha</dt>
            <dd className="item-text">{formatDate(report.date_report)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Tipo de reporte</dt>
            <dd className="item-text">
              {isOther && report.other_type ? `${typeLabel}: ${report.other_type}` : typeLabel}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">
              {report.site
                ? [report.site.name, report.site.city].filter(Boolean).join(', ')
                : '—'}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Descripción</dt>
            <dd className="item-text whitespace-pre-line">{report.description}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Evidencia</dt>
            <dd className="item-text break-all">
              {isHttpUrl(report.evidence_url) ? (
                <a href={report.evidence_url} target="_blank" rel="noopener noreferrer">
                  {report.evidence_url}
                </a>
              ) : (
                report.evidence_url || '—'
              )}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Anónimo</dt>
            <dd className="item-text">{report.anonymity ? 'Sí' : 'No'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Registrado</dt>
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
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este reporte?"
          onConfirm={handleConfirmDelete}
          primaryLabel={deleting ? 'Eliminando...' : 'Eliminar'}
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

      {/* El estudiante solo puede editar o eliminar mientras el reporte siga abierto. */}
      {report.is_open ? (
        <div className="info-actions mt-16">
          <button
            type="button"
            className="btn-tertiary"
            onClick={handleEditButton}
            disabled={deleting}
          >
            Editar reporte
          </button>
          <button
            type="button"
            className="btn-tertiary"
            onClick={handleDeleteButton}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar reporte'}
          </button>
        </div>
      ) : (
        <p className="mt-16 text-gray-500">
          La coordinación cerró este reporte; ya no se puede editar ni eliminar.
        </p>
      )}
    </div>
  );
}

export default ReportDetail;

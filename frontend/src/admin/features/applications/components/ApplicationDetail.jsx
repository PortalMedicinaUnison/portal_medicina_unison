import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useDeleteApplication from '../hooks/useDeleteApplication';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS, PERIOD_LABELS, PROGRAMS, labelOf } from '../../../../utils/constants';
import ExpedientePanel from '../../../../features/expediente/components/ExpedientePanel';
import { formatDateTime } from '../../../../utils/utils';


function ApplicationDetail({ application, fetching, fetchError, refetch, applicationId }) {
  const navigate = useNavigate();
  const { deleteApplication, loading: deleting, success: deleted, error: deleteError, reset } = useDeleteApplication();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!applicationId) return;
    await deleteApplication(applicationId);
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST), { replace: true });
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
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

  if (!application) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta aplicación."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const { student, promotion } = application;
  const isAnswered = Number(application.status) !== APPLICATION_STATUS.PENDING;

  return (
    <div className="info-container">
      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Alumno</dt>
            <dd className="item-text">
              {student
                ? <>{student.first_name} {student.last_name} {student.second_last_name}</>
                : 'Sin datos del alumno'}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Expediente</dt>
            <dd className="item-text">{application.academic_id}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Correo</dt>
            <dd className="item-text">{student?.email ?? '—'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Promoción</dt>
            <dd className="item-text">
              {promotion
                ? `${promotion.year} - ${labelOf(PERIOD_LABELS, promotion.period)}${promotion.is_finished ? ' (finalizada)' : ''}`
                : '—'}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{labelOf(APPLICATION_STATUS_LABELS, application.status)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Fecha de asignación</dt>
            <dd className="item-text">{formatDateTime(application.created_at)}</dd>
          </div>
          {isAnswered && (
            <div className="item-row">
              <dt className="item-header">Fecha de respuesta</dt>
              <dd className="item-text">{formatDateTime(application.updated_at)}</dd>
            </div>
          )}
          {application.internship_id != null && (
            <div className="item-row">
              <dt className="item-header">Internado</dt>
              <dd className="item-text">
                <Link to={adminAbs(ROUTES.ADMIN.INTERNSHIP_DETAIL(application.internship_id))}>
                  Ver internado
                </Link>
              </dd>
            </div>
          )}
          {application.inscription_progress && (
            <div className="item-row">
              <dt className="item-header">Documentos de inscripción</dt>
              <dd className="item-text">
                {application.inscription_progress.complete
                  ? <span className="text-green-700">Completo</span>
                  : `${application.inscription_progress.approved} de ${application.inscription_progress.required} obligatorios aprobados`}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
        <ExpedientePanel
          program={PROGRAMS.INTERNSHIP}
          applicationId={application.application_id}
          mode="admin"
          started={application.internship_id != null}
          onChange={refetch}
        />
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar la aplicación?"
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
          message={deleteError || 'Ocurrió un problema al eliminar la aplicación.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
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

export default ApplicationDetail;

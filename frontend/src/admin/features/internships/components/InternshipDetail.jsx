import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateInternship from '../hooks/useUpdateInternship';
import useDeleteInternship from '../hooks/useDeleteInternship';
import useGetPsdsByPromotion from '../hooks/useGetPsdsByPromotion';
import ExpedientePanel from '../../../../features/expediente/components/ExpedientePanel';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { INTERNSHIP_STATUS_LABELS, PERIOD_LABELS, PROGRAMS, labelOf } from '../../../../utils/constants';


function InternshipDetail({ internship, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { psds, loading: fetchingPsds, error: psdsError, refetch: refetchPsds } = useGetPsdsByPromotion(internship?.promotion_id);
  const { updateInternship: updateSite, loading: savingSite, success: siteSaved, error: siteError, reset: resetSite } = useUpdateInternship();
  const { updateInternship: updateStatus, loading: savingStatus, success: statusSaved, error: statusError, reset: resetStatus } = useUpdateInternship();
  const { deleteInternship, loading: deleting, success: deleted, error: deleteError, reset: resetDelete } = useDeleteInternship();

  // null = sin cambios: el select muestra el valor guardado en el internado.
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const currentSiteId = internship?.site_id != null ? String(internship.site_id) : '';
  const currentStatus = internship ? String(internship.status) : '';
  const siteValue = selectedSiteId ?? currentSiteId;
  const statusValue = selectedStatus ?? currentStatus;
  const saving = savingSite || savingStatus;

// ---------------------- HANDLERS ----------------------

  const handleSiteChange = (e) => {
    setSelectedSiteId(e.target.value);
    resetSite();
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    resetStatus();
  };

  const handleSaveSite = async () => {
    const siteId = siteValue === '' ? null : Number(siteValue);
    const response = await updateSite(internship.internship_id, { site_id: siteId });
    if (response) {
      refetch();
      refetchPsds();
    }
  };

  const handleSaveStatus = async () => {
    const response = await updateStatus(internship.internship_id, { status: Number(statusValue) });
    if (response) {
      refetch();
      refetchPsds(); // Finalizar o reactivar el internado libera u ocupa su cupo en la sede.
    }
  };

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!internship) return;
    await deleteInternship(internship.internship_id);
  };

  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    resetDelete();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      resetDelete();
      navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_LIST), { replace: true });
    }
  }, [deleted, navigate, resetDelete]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  // Al recargar después de guardar se mantienen los datos en pantalla.
  if (fetching && !internship) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

  if (!internship) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para este internado."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const student = internship.application?.student;
  const promotion = internship.application?.promotion;
  const site = internship.site;
  // Si la sede actual no aparece entre los cupos de la promoción, se agrega como opción para que el select la muestre.
  const showCurrentSiteOption = currentSiteId !== '' && !psds.some((psd) => String(psd.site_id) === currentSiteId);
  const currentSiteName = site?.name ?? 'Sede actual';

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
            <dd className="item-text">{internship.academic_id}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Correo</dt>
            <dd className="item-text">{student?.email ?? '—'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Promoción</dt>
            <dd className="item-text">
              {promotion ? `${promotion.year} - ${labelOf(PERIOD_LABELS, promotion.period)}` : '—'}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">{site ? `${site.name} (${site.city})` : 'Sin sede asignada'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{labelOf(INTERNSHIP_STATUS_LABELS, internship.status)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Asignación</dt>
            <dd className="item-text">
              <Link to={adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_DETAIL(internship.application_id))}>
                Ver asignación
              </Link>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrar internado</h3>
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">
                <label htmlFor="internship-site">Asignar sede</label>
              </dt>
              <dd className="item-text">
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    id="internship-site"
                    className="form-input--half"
                    value={siteValue}
                    onChange={handleSiteChange}
                    disabled={saving || fetchingPsds}
                  >
                    <option value="">Sin sede asignada</option>
                    {showCurrentSiteOption && (
                      <option value={currentSiteId}>
                        {fetchingPsds || psdsError ? currentSiteName : `${currentSiteName} — sin cupo registrado en la promoción`}
                      </option>
                    )}
                    {psds.map((psd) => {
                      const isCurrent = String(psd.site_id) === currentSiteId;
                      const isFull = psd.occupied >= psd.capacity;
                      const name = psd.site?.name ?? `Sede ${psd.site_id}`;
                      return (
                        <option key={psd.psd_id} value={psd.site_id} disabled={isFull && !isCurrent}>
                          {`${name} — ${psd.occupied}/${psd.capacity}${isFull && !isCurrent ? ' (sin cupo)' : ''}`}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveSite}
                    disabled={siteValue === currentSiteId || saving || fetching}
                  >
                    {savingSite ? 'Guardando...' : 'Guardar sede'}
                  </button>
                </div>
                {psdsError && <p className="text-sm text-red-600 mt-2">{psdsError}</p>}
                {!fetchingPsds && !psdsError && psds.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    La promoción de este internado no tiene sedes con cupo registradas.
                  </p>
                )}
                {siteError && <p className="text-sm text-red-600 mt-2">{siteError}</p>}
                {siteSaved && <p className="text-sm text-green-600 mt-2">Sede actualizada.</p>}
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">
                <label htmlFor="internship-status">Estatus</label>
              </dt>
              <dd className="item-text">
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    id="internship-status"
                    className="form-input--half"
                    value={statusValue}
                    onChange={handleStatusChange}
                    disabled={saving}
                  >
                    {Object.entries(INTERNSHIP_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveStatus}
                    disabled={statusValue === currentStatus || saving || fetching}
                  >
                    {savingStatus ? 'Guardando...' : 'Guardar estatus'}
                  </button>
                </div>
                {statusError && <p className="text-sm text-red-600 mt-2">{statusError}</p>}
                {statusSaved && <p className="text-sm text-green-600 mt-2">Estatus actualizado.</p>}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
        <ExpedientePanel program={PROGRAMS.INTERNSHIP} applicationId={internship.application_id} mode="admin" />
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Se dará de baja el internado y la asignación del alumno volverá a quedar pendiente. ¿Deseas continuar?"
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
          message={deleteError || 'Ocurrió un problema al eliminar el internado.'}
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
          {deleting ? 'Eliminando...' : 'Eliminar internado'}
        </button>
      </div>
    </div>
  );
}

export default InternshipDetail;

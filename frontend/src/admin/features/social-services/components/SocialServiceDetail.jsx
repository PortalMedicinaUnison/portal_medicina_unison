import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateSocialService from '../hooks/useUpdateSocialService';
import useDeleteSocialService from '../hooks/useDeleteSocialService';
import useGetPsdsByPromotion from '../../internships/hooks/useGetPsdsByPromotion';
import SocialServiceDocumentList from '../documents/components/SocialServiceDocumentList';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { SOCIAL_SERVICE_STATUS_LABELS, PERIOD_LABELS, labelOf } from '../../../../utils/constants';
import { formatFullName } from '../../../../utils/utils';


function SocialServiceDetail({ socialService, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  // Cupos de las sedes en la promoción; `occupied` cuenta los servicios sociales no liberados.
  const { psds, loading: fetchingPsds, error: psdsError, refetch: refetchPsds } = useGetPsdsByPromotion(socialService?.promotion_id);
  const { updateSocialService: updateSite, loading: savingSite, success: siteSaved, error: siteError, reset: resetSite } = useUpdateSocialService();
  const { updateSocialService: updateStatus, loading: savingStatus, success: statusSaved, error: statusError, reset: resetStatus } = useUpdateSocialService();
  const { deleteSocialService, loading: deleting, success: deleted, error: deleteError, reset: resetDelete } = useDeleteSocialService();

  // null = sin cambios: el select muestra el valor guardado en el servicio social.
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const currentSiteId = socialService?.site_id != null ? String(socialService.site_id) : '';
  const currentStatus = socialService ? String(socialService.status) : '';
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
    const response = await updateSite(socialService.social_service_id, { site_id: siteId });
    if (response) {
      refetch();
      refetchPsds();
    }
  };

  const handleSaveStatus = async () => {
    const response = await updateStatus(socialService.social_service_id, { status: Number(statusValue) });
    if (response) {
      refetch();
      refetchPsds(); // Liberar o reactivar el servicio social libera u ocupa su plaza.
    }
  };

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!socialService) return;
    await deleteSocialService(socialService.social_service_id);
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
      navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_LIST), { replace: true });
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
  if (fetching && !socialService) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

  if (!socialService) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para este servicio social."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_LIST))}
        secondaryLabel="Ir a la lista"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const student = socialService.application?.student;
  const promotion = socialService.application?.promotion;
  const site = socialService.site;
  // Si la plaza actual no aparece entre los cupos de la promoción, se agrega como opción para que el select la muestre.
  const showCurrentSiteOption = currentSiteId !== '' && !psds.some((psd) => String(psd.site_id) === currentSiteId);
  const currentSiteName = site?.name ?? 'Plaza actual';

  return (
    <div className="info-container">
      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Alumno</dt>
            <dd className="item-text">{formatFullName(student) || 'Sin datos del alumno'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Expediente</dt>
            <dd className="item-text">{socialService.academic_id}</dd>
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
            <dt className="item-header">Plaza</dt>
            <dd className="item-text">{site ? `${site.name} (${site.city})` : 'Sin plaza asignada'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{labelOf(SOCIAL_SERVICE_STATUS_LABELS, socialService.status)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Asignación</dt>
            <dd className="item-text">
              <Link to={adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_DETAIL(socialService.application_id))}>
                Ver asignación
              </Link>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrar servicio social</h3>
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">
                <label htmlFor="social-service-site">Asignar plaza</label>
              </dt>
              <dd className="item-text">
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    id="social-service-site"
                    className="form-input--half"
                    value={siteValue}
                    onChange={handleSiteChange}
                    disabled={saving || fetchingPsds}
                  >
                    <option value="">Sin plaza asignada</option>
                    {showCurrentSiteOption && (
                      <option value={currentSiteId}>
                        {fetchingPsds || psdsError ? currentSiteName : `${currentSiteName} — sin plazas registradas en la promoción`}
                      </option>
                    )}
                    {psds.map((psd) => {
                      const isCurrent = String(psd.site_id) === currentSiteId;
                      const isFull = psd.occupied >= psd.capacity;
                      const name = psd.site?.name ?? `Sede ${psd.site_id}`;
                      return (
                        <option key={psd.psd_id} value={psd.site_id} disabled={isFull && !isCurrent}>
                          {`${name} — ${psd.occupied}/${psd.capacity}${isFull && !isCurrent ? ' (sin plazas disponibles)' : ''}`}
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
                    {savingSite ? 'Guardando...' : 'Guardar plaza'}
                  </button>
                </div>
                {psdsError && <p className="text-sm text-red-600 mt-2">{psdsError}</p>}
                {!fetchingPsds && !psdsError && psds.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    La promoción de este servicio social no tiene sedes con plazas registradas.
                  </p>
                )}
                {siteError && <p className="text-sm text-red-600 mt-2">{siteError}</p>}
                {siteSaved && <p className="text-sm text-green-600 mt-2">Plaza actualizada.</p>}
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">
                <label htmlFor="social-service-status">Estatus</label>
              </dt>
              <dd className="item-text">
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    id="social-service-status"
                    className="form-input--half"
                    value={statusValue}
                    onChange={handleStatusChange}
                    disabled={saving}
                  >
                    {Object.entries(SOCIAL_SERVICE_STATUS_LABELS).map(([value, label]) => (
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
        <SocialServiceDocumentList socialServiceId={socialService.social_service_id} />
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Se dará de baja el servicio social y la asignación del alumno volverá a quedar pendiente. ¿Deseas continuar?"
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
          message={deleteError || 'Ocurrió un problema al eliminar el servicio social.'}
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
          {deleting ? 'Eliminando...' : 'Eliminar servicio social'}
        </button>
      </div>
    </div>
  );
}

export default SocialServiceDetail;

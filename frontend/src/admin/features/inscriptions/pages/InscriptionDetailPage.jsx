import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import ExpedientePanel from '../../../../features/expediente/components/ExpedientePanel';
import {
  deleteInscriptionRequest, deleteProgramRecordRequest, getInscriptionRequest,
} from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { formatDateTime, formatFullName, promotionLabel } from '../../../../utils/utils';
import { INSCRIPTION_PROGRAMS, inscriptionStatus } from '../programs';
import DocumentsStatus from '../components/DocumentsStatus';
import InscriptionManagement from '../components/InscriptionManagement';


/**
 * Ficha completa de una inscripción: datos de la asignación, sede o plaza y estatus del
 * programa, y documentos. Sustituye a los detalles separados de asignación y de internado.
 */
function InscriptionDetailPage({ program }) {
  const config = INSCRIPTION_PROGRAMS[program];
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null); // 'record' | 'application'
  const [actionError, setActionError] = useState(null);
  const [working, setWorking] = useState(false);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    if (!loaded.current) setLoading(true);
    try {
      const { data } = await getInscriptionRequest(program, applicationId);
      setApplication(data);
      setError(null);
      loaded.current = true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la inscripción.'));
    } finally {
      setLoading(false);
    }
  }, [program, applicationId]);

  useEffect(() => { load(); }, [load]);

  const record = application?.[config.recordKey];
  const listUrl = application ? `${config.listPath}?promotion_id=${application.promotion_id}` : config.listPath;

  const handleConfirm = async () => {
    const what = confirm;
    setConfirm(null);
    setWorking(true);
    setActionError(null);
    try {
      if (what === 'record') {
        await deleteProgramRecordRequest(program, record[config.recordIdKey]);
        await load();
      } else {
        await deleteInscriptionRequest(program, application.application_id);
        const who = formatFullName(application.student) || application.academic_id;
        navigate(listUrl, { replace: true, state: { notice: `Se eliminó la asignación de ${who}.` } });
      }
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo completar la acción.'));
    } finally {
      setWorking(false);
    }
  };

  const title = application ? `${config.name} · ${formatFullName(application.student) || application.academic_id}` : config.name;

  return (
    <Layout>
      <PageLayout title={title}>
        {loading && <LoadingSpinner />}
        {!loading && error && <DataLoadError title="No se pudo cargar la inscripción" message={error} onRetry={load} onSecondary={() => navigate(listUrl)} secondaryLabel="Volver a la lista" />}
        {!loading && application && (
          <div className="info-container">
            <div className="item-container">
              <dl className="item-list">
                <div className="item-row"><dt className="item-header">Expediente</dt><dd className="item-text font-mono">{application.academic_id}</dd></div>
                <div className="item-row"><dt className="item-header">Correo</dt><dd className="item-text">{application.student?.email ?? '—'}</dd></div>
                <div className="item-row">
                  <dt className="item-header">Promoción</dt>
                  <dd className="item-text">{promotionLabel(application.promotion)}{application.promotion?.is_finished ? ' (finalizada)' : ''}</dd>
                </div>
                <div className="item-row"><dt className="item-header">Estatus</dt><dd className="item-text">{inscriptionStatus(application, config).label}</dd></div>
                <div className="item-row"><dt className="item-header">Documentos de inscripción</dt><dd className="item-text"><DocumentsStatus progress={application.inscription_progress} /></dd></div>
                <div className="item-row"><dt className="item-header">Asignado</dt><dd className="item-text">{formatDateTime(application.created_at)}</dd></div>
              </dl>
            </div>

            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {record ? `Administrar ${config.recordName}` : 'Administrar asignación'}
              </h3>
              <InscriptionManagement config={config} application={application} onSaved={load} />
            </div>

            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Documentos</h3>
              <ExpedientePanel program={program} applicationId={application.application_id} mode="admin" started={Boolean(record)}
                // Terminado (finalizado, liberado, renuncia o baja) o promoción finalizada: solo consulta.
                closed={Boolean(application.promotion?.is_finished) || (Boolean(record) && [3, 4, 5].includes(Number(record.status)))}
                onChange={load} />
            </div>

            {actionError && <div className="alert-error mt-8">{actionError}</div>}
            <div className="info-actions mt-16">
              {/* Solo se elimina lo que está en curso (p. ej. aceptado por error); lo terminado es historial. */}
              {record && [1, 2].includes(Number(record.status)) && (
                <button type="button" className="btn-tertiary text-red-600" onClick={() => setConfirm('record')} disabled={working}>
                  Eliminar {config.recordName}
                </button>
              )}
              {!record && (
                <button type="button" className="btn-tertiary text-red-600" onClick={() => setConfirm('application')} disabled={working}>
                  Eliminar asignación
                </button>
              )}
            </div>

            <Modal open={Boolean(confirm)} onClose={() => setConfirm(null)}>
              <ConfirmDialogContent
                title={confirm === 'record' ? `Eliminar ${config.recordName}` : 'Eliminar asignación'}
                message={confirm === 'record'
                  ? `Se eliminará el ${config.recordName} (y su ${config.placeLabel.toLowerCase()}) y la asignación volverá a quedar pendiente de aceptar. ¿Continuar?`
                  : 'El alumno dejará de estar asignado a esta promoción. ¿Continuar?'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm(null)}
                primaryLabel="Eliminar"
                secondaryLabel="Cancelar"
                danger
              />
            </Modal>
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}

export default InscriptionDetailPage;

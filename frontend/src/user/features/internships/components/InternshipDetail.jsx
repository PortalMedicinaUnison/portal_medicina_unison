import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { INTERNSHIP_STATUS, INTERNSHIP_STATUS_LABELS, PROGRAMS, isExitStatus, labelOf } from '../../../../utils/constants';
import { promotionLabel } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import ExpedientePanel from '../../../../features/expediente/components/ExpedientePanel';
import RecordExitNotice from '../../../../components/RecordExitNotice';
import SiteInfo from '../../../../components/SiteInfo';


function InternshipDetail({ internship, fetching, fetchError, refetch }) {
  const navigate = useNavigate();

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar tu internado"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  // Sin internado: todavía no acepta su asignación, la declinó o no tiene una.
  if (!internship) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[40vh] text-center">
        <h3 className="text-xl font-semibold text-gray-900">Aún no tienes un internado</h3>
        <p className="max-w-md text-gray-500">
          Tu internado se crea cuando aceptas tu asignación a una promoción. Si todavía no respondes
          a tu asignación o la declinaste, revisa su estado.
        </p>
        <Link to={ROUTES.USER.INTERNSHIP_REDIRECT} className="btn-primary">
          Revisar mi asignación
        </Link>
      </div>
    );
  }

// ---------------------- RENDER ----------------------

  const promotion = internship.application?.promotion;
  const { site } = internship;
  const hasLeft = isExitStatus(internship.status);

  return (
    <div className="info-container">
      {hasLeft && (
        <RecordExitNotice
          record={internship}
          programName="internado"
          afterWithdrawal="Si vuelves a participar, la coordinación te asignará a una promoción posterior."
        />
      )}
      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Promoción</dt>
            <dd className="item-text">
              {promotionLabel(promotion)}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{labelOf(INTERNSHIP_STATUS_LABELS, internship.status)}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">
              <SiteInfo site={site} emptyText="Pendiente de asignación de sede" />
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis documentos</h3>
        <ExpedientePanel
          program={PROGRAMS.INTERNSHIP}
          applicationId={internship.application_id}
          started
          closed={Number(internship.status) === INTERNSHIP_STATUS.FINISHED || hasLeft || Boolean(promotion?.is_finished)}
        />
      </div>
    </div>
  );
}

export default InternshipDetail;

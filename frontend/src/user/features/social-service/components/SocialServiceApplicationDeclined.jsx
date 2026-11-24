import { useNavigate } from 'react-router-dom';
import { promotionLabel } from '../../../../utils/utils';
import NoSocialServiceApplication from './NoSocialServiceApplication';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


function SocialServiceApplicationDeclined({ application, fetching, fetchError, refetch, user }) {
  const navigate = useNavigate();

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar tu asignación de servicio social"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!application) return <NoSocialServiceApplication onReload={refetch} />;

// ---------------------- RENDER ----------------------

  const { promotion } = application;
  const promotionName = promotionLabel(promotion);
  const fullName = [user?.first_name, user?.last_name, user?.second_last_name].filter(Boolean).join(' ');

  return (
    <div className="w-3/4 flex flex-col gap-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="mb-4">
          Estimado(a) <b>{fullName}</b>,
        </p>
        <p>
          Confirmamos que has <b>declinado tu participación</b> en la promoción{' '}
          <b>{promotionName}</b> del Servicio Social.
        </p>
      </div>

      <section>
        <h3 className="font-bold text-base mb-2">
          Próxima promoción
        </h3>
        <p>
          Te invitamos a estar pendiente de la siguiente convocatoria para el Servicio Social.
          Las fechas y requisitos serán publicados oportunamente en los canales oficiales de la facultad.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2">
          Contacto con coordinación
        </h3>
        <p>
          Para cualquier duda, aclaración o información adicional sobre tu situación académica,
          te solicitamos que te acerques a la <b>coordinación del Servicio Social</b> a la brevedad posible.
        </p>
      </section>
    </div>
  );
}

export default SocialServiceApplicationDeclined;

import { useNavigate } from 'react-router-dom';
import { promotionLabel } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


function ApplicationDeclined({ application, fetching, fetchError, refetch, user }) {
  const navigate = useNavigate();

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar tu asignación al internado"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!application) {
    return (
      <DataLoadError
        title="Aún no tienes una asignación"
        message="No encontramos una asignación al internado a tu nombre. Contacta a la coordinación para verificar tu estado."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  const { promotion } = application;
  const fullName = [user?.first_name, user?.last_name, user?.second_last_name].filter(Boolean).join(' ');

  return (
    <div className="w-3/4 flex flex-col gap-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="mb-4">
          Estimado(a) <b>{fullName}</b>,
        </p>
        <p>
          Confirmamos que has <b>declinado tu participación</b> en la promoción{' '}
          <b>{promotionLabel(promotion)}</b> del Internado Médico de Pregrado.
        </p>
      </div>

      <section>
        <h3 className="font-bold text-base mb-2">
          Próxima promoción
        </h3>
        <p>
          Te invitamos a estar pendiente de la siguiente convocatoria para el Internado Médico.
          Las fechas y requisitos serán publicados oportunamente en los canales oficiales de la facultad.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2">
          Contacto con coordinación
        </h3>
        <p>
          Para cualquier duda, aclaración o información adicional sobre tu situación académica,
          te solicitamos que te acerques al <b>coordinador del programa de Internado
          Médico</b> a la brevedad posible.
        </p>
      </section>
    </div>
  );
}

export default ApplicationDeclined;

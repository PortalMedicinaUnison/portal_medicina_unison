import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


function ApplicationDeclined({ application, fetching, fetchError, refetch, user }) {
  const navigate = useNavigate();

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar el aplicación al internado"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!application) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información sobre tu internado. Contacta a tu administrador para verificar tu estado."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  return (
    <div className="w-3/4">
      <p className="mb-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="mb-4">
            Estimado(a) <b>{user.first_name} {user.last_name} {user.second_last_name}</b>,
          </p>
          <p>
            Confirmamos que has <b>declinado tu participación</b> en la promoción del Internado Médico de Pregrado correspondiente al periodo <b>{application.promotion.year} - {application.promotion.period}</b>.
          </p>
        </div>

        <div className="mb-8">
              <h2 className="font-bold text-base mb-2">
                Próxima Promoción
              </h2>
              <p>
                Te invitamos a estar pendiente de la siguiente convocatoria para el Internado Médico. 
                Las fechas y requisitos serán publicados oportunamente en los canales oficiales de la facultad.
              </p>
          </div>

          <div className="mb-8">
            <div>
              <h2 className="font-bold text-base mb-2">
                Contacto con Coordinación</h2>
              <p>
                Para cualquier duda, aclaración o información adicional sobre tu situación académica, 
                te solicitamos que te acerques al <b>coordinador del programa de Internado 
                Médico</b> a la brevedad posible.
              </p>
            </div>
        </div>
      </p>
    </div>
  );
}

export default ApplicationDeclined;
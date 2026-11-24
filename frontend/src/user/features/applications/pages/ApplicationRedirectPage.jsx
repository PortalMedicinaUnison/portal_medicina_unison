import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';

// Vista a la que se manda al estudiante según el estado de su asignación más reciente.
const ROUTE_BY_STATUS = {
  [APPLICATION_STATUS.PENDING]: ROUTES.USER.INTERNSHIP_APPLICATION_STATUS,
  [APPLICATION_STATUS.ACCEPTED]: ROUTES.USER.INTERNSHIP,
  [APPLICATION_STATUS.DECLINED]: ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED,
};

function ApplicationRedirectPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const academicId = user?.academic_id || null;

  const { application, loading: fetching, error: fetchError, refetch } =
    useApplicationByAcademic(academicId);

  const target = application ? ROUTE_BY_STATUS[Number(application.status)] : null;
  if (!fetching && !fetchError && target) {
    return <Navigate replace to={target} />;
  }

  let content;
  if (fetching) {
    content = <LoadingSpinner />;
  } else if (fetchError) {
    content = (
      <DataLoadError
        title="No se pudo cargar la información de tu internado"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  } else if (!application) {
    content = (
      <DataLoadError
        title="Aún no tienes una asignación"
        message="Cuando la coordinación te asigne a una promoción del internado podrás aceptarla o declinarla desde aquí."
        onRetry={refetch}
        retryLabel="Recargar"
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  } else {
    content = (
      <DataLoadError
        title="Estado desconocido"
        message="Tu asignación tiene un estado no reconocido. Contacta a la coordinación del internado."
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  return (
    <Layout>
      <PageLayout title="Mi internado">
        {content}
      </PageLayout>
    </Layout>
  );
}

export default ApplicationRedirectPage;

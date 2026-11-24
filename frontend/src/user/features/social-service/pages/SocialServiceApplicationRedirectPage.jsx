import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import { useUser } from '../../../../contexts/UserContext';
import useSocialServiceApplicationByAcademic from '../hooks/useSocialServiceApplicationByAcademic';
import NoSocialServiceApplication from '../components/NoSocialServiceApplication';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';

// Vista a la que se manda al estudiante según el estado de su asignación más reciente.
const ROUTE_BY_STATUS = {
  [APPLICATION_STATUS.PENDING]: ROUTES.USER.SOCIAL_SERVICE_APPLICATION_STATUS,
  [APPLICATION_STATUS.ACCEPTED]: ROUTES.USER.SOCIAL_SERVICE,
  [APPLICATION_STATUS.DECLINED]: ROUTES.USER.SOCIAL_SERVICE_APPLICATION_DECLINED,
};

function SocialServiceApplicationRedirectPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const academicId = user?.academic_id || null;

  const { application, loading: fetching, error: fetchError, refetch } =
    useSocialServiceApplicationByAcademic(academicId);

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
        title="No se pudo cargar la información de tu servicio social"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  } else if (!application) {
    // Lo normal mientras el estudiante cursa el internado.
    content = <NoSocialServiceApplication onReload={refetch} />;
  } else {
    content = (
      <DataLoadError
        title="Estado desconocido"
        message="Tu asignación tiene un estado no reconocido. Contacta a la coordinación del servicio social."
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  return (
    <Layout>
      <PageLayout title="Mi servicio social">
        {content}
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceApplicationRedirectPage;

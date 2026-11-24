import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import SocialServiceApplicationDeclined from '../components/SocialServiceApplicationDeclined';
import { useUser } from '../../../../contexts/UserContext';
import useSocialServiceApplicationByAcademic from '../hooks/useSocialServiceApplicationByAcademic';


function SocialServiceApplicationDeclinedPage() {
  const { user } = useUser();
  const academicId = user?.academic_id;
  const { application, loading: fetching, error: fetchError, refetch } =
    useSocialServiceApplicationByAcademic(academicId);

  // Si su asignación más reciente no está declinada (p. ej. tiene una nueva pendiente),
  // la página de redirección lo manda a la vista correcta.
  if (application && Number(application.status) !== APPLICATION_STATUS.DECLINED) {
    return <Navigate replace to={ROUTES.USER.SOCIAL_SERVICE_REDIRECT} />;
  }

  return (
    <Layout>
      {/* Mientras carga se deja el título final para que no cambie al llegar los datos. */}
      <PageLayout title={fetching || application ? 'Participación declinada' : 'Mi servicio social'}>
        <SocialServiceApplicationDeclined
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceApplicationDeclinedPage;
